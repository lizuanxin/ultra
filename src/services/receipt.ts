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
        this.Auth.Grant(this.Http);
        const Ary: Array<Types.IReceipt> = await this.Http.Get('/').toPromise().then((res) => res.Content);
        return Ary.map((Iter) => this.CreateReceipt(Iter));
    }

    async SellList(): Promise<Array<Types.IReceipt>>
    {
        this.Auth.Grant(this.Http);
        const Ary: Array<Types.IReceipt> = await this.Http.Get('/selllist').toPromise().then((res) => res.Content);
        return Ary.map((Iter) => this.CreateReceipt(Iter));
    }

    CreateReceipt(Ref?: Types.IReceipt)
    {
        const Receipt = new TReceipt();
        if (TypeInfo.Assigned(Ref))
            Receipt.Assign(Ref, true);

        return Receipt;
    }

    async Save(Receipt: Types.IReceipt)
    {
        if (Receipt.Manifests.length === 0)
            return new Error('no added manifests');

        this.Auth.Grant(this.Http);
        if (! TypeInfo.Assigned(Receipt.Id))
            await this.Http.Post('/append', Receipt).toPromise().then((res) => res.Content);
        else
            return new Error('can not change receipt by this way');
    }

    async Deliver(Receipt: Types.IReceipt) // seller
    {
        const NewStatus = await this.Http.Post('/deliver', {Id: Receipt.Id}).toPromise().then((res) => res.Content);
        if (NewStatus === Types.TReceiptStatus.Delivering)
            Receipt.Status = NewStatus;
    }

    async Confirm(Receipt: Types.IReceipt) // buyer
    {
        const NewStatus = await this.Http.Post('/confirm', {Id: Receipt.Id}).toPromise().then((res) => res.Content);
        if (NewStatus === Types.TReceiptStatus.Done)
            Receipt.Status = NewStatus;
    }

    async Refund(Receipt: Types.IReceipt)
    {
        const NewStatus = await this.Http.Post('/refund', {Id: Receipt.Id}).toPromise().then((res) => res.Content);
        if (NewStatus === Types.TReceiptStatus.Refunding)
            Receipt.Status = NewStatus;
    }

    async Cancel(Receipt: Types.IReceipt)
    {
        const NewStatus =
            await this.Http.Post('/cancel', {Id: Receipt.Id, Status: Receipt.Status}).toPromise().then((res) => res.Content);
        if (NewStatus === Types.TReceiptStatus.Cancel)
            Receipt.Status = NewStatus;
    }

    private Http = new TRestClient('/api/receipt');
}

declare module './cloud/types/receipt'
{
    interface IReceipt
    {
        readonly IsParent: boolean;
        readonly HasChildReceipt: boolean;

        AddManifest(Manifest: Types.IManifest);
        RemoveManifest(Manifest: Types.IManifest);
    }
}

export class TReceipt extends TAssignable implements Types.IReceipt
{
    get IsParent(): boolean
    {
        return ! TypeInfo.Assigned((this as any).ParentId);
    }

    get HasChildReceipt(): boolean
    {
        return TypeInfo.Assigned(this.ChildReceipts) && this.ChildReceipts.length > 0;
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
    ChildReceipts: Array<Types.IReceipt>;
}

