import {Injectable} from '@angular/core';
import { TAuthService } from 'services/authorize';

import * as Types from './cloud/types';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TAssignable} from 'UltraCreation/Core/Persistable';
import {TRestClient} from 'UltraCreation/Core/Http';

@Injectable()
export class TReceiptService
{
    constructor(private Auth: TAuthService)
    {
    }

    async BuyList(): Promise<Array<Types.IReceipt>>
    {
        if (! TypeInfo.Assigned(this.BuyReceiptSnap))
        {
            this.Auth.Grant(this.Http);
            const Ary: Array<Types.IReceipt> = await this.Http.Get('/').toPromise().then((res) => res.Content);

            this.BuyReceiptSnap = new Map<string, Types.IReceipt>();
            for (const Iter of Ary)
                this.HashReceipt(this.BuyReceiptSnap, Iter);
        }
        return Array.from(this.BuyReceiptSnap.values());
    }

    async SellList(): Promise<Array<Types.IReceipt>>
    {
        if (! TypeInfo.Assigned(this.SellReceiptSnap))
        {
            this.Auth.Grant(this.Http);
            const Ary: Array<Types.IReceipt> = await this.Http.Get('/selllist').toPromise().then((res) => res.Content);

            this.SellReceiptSnap = new Map<string, Types.IReceipt>();
            for (const Iter of Ary)
                this.HashReceipt(this.SellReceiptSnap, Iter);
        }
        return Array.from(this.SellReceiptSnap.values());
    }

    async Save(Receipt: Types.IReceipt)
    {
        if (Receipt.Manifests.length === 0)
            return;
        if (! TypeInfo.Assigned(this.BuyReceiptSnap))
            await this.BuyList();

        this.Auth.Grant(this.Http);
        if (! TypeInfo.Assigned(Receipt.Id))
            this.HashReceipt(this.BuyReceiptSnap, await this.Http.Post('/store', Receipt).toPromise().then((res) => res.Content));
        else
            this.HashReceipt(this.BuyReceiptSnap, await this.Http.Put('/store', Receipt).toPromise().then((res) => res.Content));
    }

    async Remove(Receipt: Types.IReceipt)
    {
        this.Auth.Grant(this.Http);
        await this.Http.Post('/remove',
            {Id: Receipt.Id, ChildReceipts: Receipt.ChildReceipts.map((Receipt) => Receipt.Id)}).toPromise();
        this.BuyReceiptSnap.delete(Receipt.Id);
    }

    private HashReceipt(Snap: Map<string, Types.IReceipt>, Receipt: Types.IReceipt)
    {
        const NewReceipt = new TReceipt();
        NewReceipt.Assign(Receipt, true);
        Snap.set(Receipt.Id, Receipt);
    }

    private Http = new TRestClient('/api/receipt');
    private BuyReceiptSnap: Map<string, Types.IReceipt>;
    private SellReceiptSnap: Map<string, Types.IReceipt>;
}

declare module './cloud/types/receipt'
{
    interface IReceipt
    {
        readonly IsParent: boolean;

        AddManifest(Manifest: Types.IManifest);
        RemoveManifest(Manifest: Types.IManifest);

        AddChildReceipt(Receipt: Types.IReceipt);
        RemoveChildReceipt(Receipt: Types.IReceipt);
    }
}

export class TReceipt extends TAssignable implements Types.IReceipt
{
    get IsParent(): boolean
    {
        return TypeInfo.Assigned(this.SellerChildReceiptMap);
    }

    AddManifest(Manifest: Types.IManifest)
    {
        const Idx = this.IndexOfManifest(Manifest);
        if (Idx === -1)
            this.Manifests.push({Id: Manifest.Id, Qty: Manifest.Qty, Price: Manifest.Price, Memo: Manifest.Memo} as Types.IManifest);
    }

    RemoveManifest(ManifestOrId: Types.IManifest | Types.TIdentify)
    {
        const Idx = this.IndexOfManifest(ManifestOrId);
        if (Idx !== -1)
            this.Manifests.splice(Idx, 1);
    }

    AddChildReceipt(Receipt: Types.IReceipt)
    {
        if (! TypeInfo.Assigned(this.SellerChildReceiptMap))
            this.SellerChildReceiptMap = new Map<string, Types.IReceipt>();

        this.SellerChildReceiptMap.set(Receipt.Seller_Id, Receipt);
    }

    RemoveChildReceipt(Receipt: Types.IReceipt)
    {
        if (! TypeInfo.Assigned(this.SellerChildReceiptMap))
            return;

        this.SellerChildReceiptMap.delete(Receipt.Seller_Id);
    }

    get ChildReceipts(): Array<Types.IReceipt>
    {
        if (! TypeInfo.Assigned(this.SellerChildReceiptMap))
            return [];

        const _ChildReceipts = [];
        return Array.from(this.SellerChildReceiptMap.values());
    }

    set ChildReceipts(Values: Array<Types.IReceipt>)
    {
        this.SellerChildReceiptMap = new Map<string, Types.IReceipt>();
        for (const iter of Values)
        {
            const Receipt = new TReceipt();
            Receipt.Assign(iter);
            this.AddChildReceipt(Receipt);
        }
    }

    private IndexOfManifest(ManifestOrId: Types.IManifest | Types.TIdentify)
    {
        let ManifestId;
        if (TypeInfo.IsPrimitive(ManifestOrId))
            ManifestId = ManifestOrId;
        else
            ManifestId = ManifestOrId.Id;

        for (let i = 0; i < this.Manifests.length; i++)
        {
            if (ManifestId === this.Manifests[i].Id)
                return i;
        }
        return -1;
    }

    Id: Types.TIdentify = null;
    RefId?: Types.TIdentify = null;
    Seller_Id?: Types.TIdentify = null;
    ToAddress: string = null;      // of JSON address redundancy storage
    Memo: string = null;
    Status: Types.TReceiptStatus = null;
    Timestamp: Date = null;

    Manifests: Types.IManifest[] = [];
    SellerChildReceiptMap: Map<string, Types.IReceipt>;
}

