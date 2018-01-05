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
                let Receipt: TReceipt;
                if (Iter.TypeId === Types.TReceiptTypeId.Purchase)
                    Receipt = new TPurchase();
                else
                    Receipt = new TOrder();
                Receipt.Assign(Iter);
                this.ReceiptSnap.set(Iter.Id, Receipt);
            }
        }
        return Array.from(this.ReceiptSnap.values());
    }

    async Append(Receipt: TReceipt)
    {
        this.Auth.Grant(this.Http);
        await this.Http.Post('/append', Receipt).toPromise();
        this.ReceiptSnap.set(Receipt.Id, Receipt);
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
        await this.Http.Post('/remove', {Id: Receipt.Id, TypeId: Receipt.TypeId}).toPromise();
        this.ReceiptSnap.delete(Receipt.Id);
    }

    private Http = new TRestClient('/api/receipt');
    private ReceiptSnap: Map<string, TReceipt>;
}

export class TReceipt extends TAssignable implements Types.IReceipt
{
    get IsPurchase(): boolean
    {
        return this.TypeId === Types.TReceiptTypeId.Purchase;
    }

    Add(Manifest: Types.IManifest)
    {
        let Idx = this.Index(Manifest);
        if (Idx === -1)
            this.Manifests.push(Manifest);
    }

    Remove(Manifest: Types.IManifest | Types.TIdentify)
    {
        let Idx = this.Index(Manifest);
        if (Idx !== -1)
            this.Manifests.splice(Idx, 1);
    }

    private Index(ManifestOrId: Types.IManifest | Types.TIdentify)
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
    TypeId: Types.TReceiptTypeId = null;
    RefId?: Types.TIdentify = null;

    ToAddress: string = null;      // of JSON address redundancy storage

    Memo: string = null;
    Manifests: Types.IManifest[] = null;
}

export class TPurchase extends TReceipt implements Types.IPurchase
{

}

export class TOrder extends TReceipt implements Types.IOrder
{
}

