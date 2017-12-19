import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TRestClient} from 'UltraCreation/Core/Http';
import {TAssignable} from 'UltraCreation/Core/Persistable';

import * as Types from './cloud/types';
import {TAuthService} from './auth';

@Injectable()
export class TItemService
{
    constructor(private Auth: TAuthService)
    {
    }

    async List(): Promise<Array<TItem>>
    {
        console.log(this.Snap);
        if (! TypeInfo.Assigned(this.Snap))
        {
            this.Auth.Grant(this.Http);
            const ary: Array<Types.IItem> = await this.Http.Get('/').toPromise().then(res => res.Content);

            this.Snap = new Map<string, TItem>();
            for (const iter of ary)
            {
                let Item: TItem;
                if (iter.TypeId === Types.TItemTypeId.Package)
                    Item = new TPackage();
                else
                    Item = new TProduct();
                Item.Assign(Item);
                this.Snap.set(iter.Id, Item);
            }
        }

        console.log(this.Snap);
        return Array.from(this.Snap.values());
    }

    async Open(Id: number): Promise<Types.IItem>
    {
        return null;
    }

    async Append(item: TItem): Promise<void>
    {
        console.log(JSON.stringify(item));
        this.Auth.Grant(this.Http);

        const res = await this.Http.Post('/append', item).toPromise();
        item.Id = res.Content.Id;

        this.Snap.set(item.Id, item);
    }

    async Update(item: TItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        switch (item.TypeId)
        {
        case Types.TItemTypeId.Package:
            const Package = item as Types.IPackage;
            Package.ProductInfoList.forEach((ProductInfo) =>
            {
                if (! TypeInfo.IsPrimitive(ProductInfo.Product))
                    ProductInfo.Product = ProductInfo.Product.Id;
            });
            await this.Http.Post('/update', item).toPromise();
            break;

        case Types.TItemTypeId.Product:
            await this.Http.Post('/update', item).toPromise();
            break;
        }
    }

    async Remove(item: TItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        await this.Http.Post('/remove', {Id: item.Id}).toPromise();
        this.Snap.delete(item.Id);
    }

    private Http = new TRestClient('/api/item');
    private Snap: Map<string, TItem>;
}

export class TPictureList
{
    constructor(protected Pictures: Array<Types.IPicture> = [])
    {
        Pictures.sort((A: Types.IPicture, B: Types.IPicture) => A.Idx - B.Idx);
    }

    get Urls(): Array<string>
    {
        return this.Pictures.map((Picture) => Picture.Url);
    }

    get Size(): number
    {
        return this.Pictures.length;
    }

    Remove(Idx: number)
    {
        let Picture = this.Picture(Idx);
        if (TypeInfo.Assigned(Picture))
            this.Pictures.splice(Idx);
    }

    Add(Url: string)
    {
        let Idx: number = 0;
        if (this.Size > 0)
            Idx = this.Picture(this.Size - 1).Idx + 1;
    }

    Update(Idx: number, Url: string)
    {
        let Picture = this.Picture(Idx);
        if (TypeInfo.Assigned(Picture) && TypeInfo.Assigned(Url))
            Picture.Url = Url;
    }

    Picture(Idx: number): Types.IPicture
    {
        if (Idx >= this.Size || Idx < 0)
            return null;
        return this.Pictures[Idx];
    }
}

export class TItem extends TAssignable implements Types.IItem
{
    get PictureList(): TPictureList
    {
        if (! TypeInfo.Assigned(this._PictureList))
            this._PictureList = new TPictureList(this.Pictures);

        return this._PictureList;
    }

    get Timestamp()
    {
        return null;
    }

    Id: string;
    TypeId: Types.TItemTypeId;
    Name: string;
    Pictures: Array<Types.IPicture>;
    AvatarUrl: string;

    protected _PictureList: TPictureList;
}

export class TProduct extends TItem implements Types.IProduct
{
    constructor()
    {
        super();
    }

    get TypeId()
    {
        return Types.TItemTypeId.Product;
    }
}

export class TPackage extends TItem implements Types.IPackage
{
    get TypeId()
    {
        return Types.TItemTypeId.Package;
    }

    Add(ProductOrId: string | TProduct, Qty: number)
    {
        if (ProductOrId instanceof TProduct)
            ProductOrId = ProductOrId.Id;
        this.ProductInfoList.push({Product: ProductOrId, Qty: Qty});
    }

    Remove(ProductOrId: string | TProduct)
    {
        let Idx = this.GetProductIndex(ProductOrId);
        if (Idx !== -1)
            this.ProductInfoList.splice(Idx);
    }

    Update(ProductOrId: string | TProduct, Qty: number)
    {
        let Idx = this.GetProductIndex(ProductOrId);
        if (Idx !== -1)
            this.ProductInfoList[Idx].Qty = Qty;
    }

    private GetProductIndex(ProductOrId: string | TProduct)
    {
        if (ProductOrId instanceof TProduct)
            ProductOrId = ProductOrId.Id;

        let ProductInfo;
        for (let i = 0; i < this.ProductInfoList.length; i++)
        {
            ProductInfo = this.ProductInfoList[i];
            if (TypeInfo.IsPrimitive(ProductInfo.Product) && ProductOrId === ProductInfo.Product)
                return i;
            else if (ProductOrId === ProductInfo.Product.Id)
                return i;
        }

        return -1;
    }

    ProductInfoList: Array<Types.IProductInfo>;
}

