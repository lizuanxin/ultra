import {Injectable} from '@angular/core';
import { TAuthService } from 'services/authorize';

import * as Types from './cloud/types';
import { TAssignable, TRestClient, TypeInfo } from 'UltraCreation/Core';

@Injectable()
export class TReceiptService
{
    constructor(private Auth: TAuthService)
    {
    }

    async List(): Promise<Array<TReceipt>>
    {
        if (! TypeInfo.Assigned(this.ReceiptSnap))
        {
            this.Auth.Grant(this.Http);
            const Ary: Array<Types.IReceipt> = await this.Http.Get('/').toPromise().then((res) => res.Content);

            this.ReceiptSnap = new Map<string, TReceipt>();
            for (let Iter of Ary)
            {
                let Receipt = new TReceipt();
                Receipt.Assign(Iter);
                this.ReceiptSnap.set(Iter.Id, Receipt);
            }
        }
        return Array.from(this.ReceiptSnap.values());
    }

    async Append(Receipt: TReceipt)
    {
        if (Receipt.Manifests.length === 0)
            return;
        if (! TypeInfo.Assigned(this.ReceiptSnap))
            await this.List();

        this.Auth.Grant(this.Http);
        const RetVal = await this.Http.Post('/append', Receipt).toPromise().then((res) => res.Content);
        const RetReceipt = new TReceipt();
        RetReceipt.Assign(RetVal);
        this.ReceiptSnap.set(RetVal.Id, RetReceipt);
    }

    async Update(Receipt: TReceipt)
    {
        this.Auth.Grant(this.Http);
        await this.Http.Post('/update', Receipt).toPromise();
        this.ReceiptSnap.set(Receipt.Id, Receipt);
    }

    async Remove(Receipt: TReceipt)
    {
        this.Auth.Grant(this.Http);
        await this.Http.Post('/remove',
            {Id: Receipt.Id, ChildReceipts: Receipt.ChildReceipts.map((Receipt) => Receipt.Id)}).toPromise();
        this.ReceiptSnap.delete(Receipt.Id);
    }

    private Http = new TRestClient('/api/receipt');
    private ReceiptSnap: Map<string, TReceipt>;
}

export class TReceipt extends TAssignable implements Types.IReceipt
{
    IsParentReceipt()
    {
        return TypeInfo.Assigned(this.SellerChildReceiptMap);
    }

    AddManifest(Manifest: Types.IManifest)
    {
        let Idx = this.IndexOfManifest(Manifest);
        if (Idx === -1)
            this.Manifests.push({Id: Manifest.Id, Qty: Manifest.Qty, Price: Manifest.Price, Memo: Manifest.Memo} as Types.IManifest);
    }

    RemoveManifest(ManifestOrId: Types.IManifest | Types.TIdentify)
    {
        let Idx = this.IndexOfManifest(ManifestOrId);
        if (Idx !== -1)
            this.Manifests.splice(Idx, 1);
    }

    AddChildReceipt(Receipt: TReceipt)
    {
        if (! TypeInfo.Assigned(this.SellerChildReceiptMap))
            this.SellerChildReceiptMap = new Map<string, TReceipt>();

        this.SellerChildReceiptMap.set(Receipt.Seller_Id, Receipt);
    }

    RemoveChildReceipt(Receipt: TReceipt)
    {
        if (! TypeInfo.Assigned(this.SellerChildReceiptMap))
            return;

        this.SellerChildReceiptMap.delete(Receipt.Seller_Id);
    }

    get ChildReceipts(): Array<Types.IReceipt>
    {
        if (! TypeInfo.Assigned(this.SellerChildReceiptMap))
            return [];

        let _ChildReceipts = [];
        return Array.from(this.SellerChildReceiptMap.values());
    }

    set ChildReceipts(Values: Array<Types.IReceipt>)
    {
        this.SellerChildReceiptMap = new Map<string, TReceipt>();
        for (let iter of Values)
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
    SellerChildReceiptMap: Map<string, TReceipt>;
}

