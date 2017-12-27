import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TRestClient} from 'UltraCreation/Core/Http';
import {TAssignable} from 'UltraCreation/Core/Persistable';

import * as Types from './cloud/types';
import {TAuthService} from './authorize';

@Injectable()
export class TItemService
{
    constructor(private Auth: TAuthService)
    {
    }

    GetItem(ItemId: string): TItem
    {
        return this.Snap.get(ItemId);
    }

    async List(): Promise<Array<TItem>>
    {
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
                Item.Assign(iter);
                this.Snap.set(iter.Id, Item);
            }
        }

        return Array.from(this.Snap.values());
    }

    async Open(Id: number): Promise<Types.IItem>
    {
        return null;
    }

    async Append(item: TItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        const res = await this.Http.Post('/append', item.toString()).toPromise();
        item.Id = res.Content.Id;

        this.Snap.set(item.Id, item);
    }

    async Update(item: TItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        const res = await this.Http.Post('/update', item.toString()).toPromise();
        this.Snap.set(item.Id, item);
    }

    async Remove(item: TItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        await this.Http.Post('/remove', {Id: item.Id, TypeId: item.TypeId}).toPromise();
        this.Snap.delete(item.Id);
    }

    private Http = new TRestClient('/api/item');
    private Snap: Map<string, TItem>;
}

export class TFileList
{
    constructor(protected Files: Array<Types.IFile> = [])
    {
    }

    get Paths()
    {
        return this.Files.map((UserFile) => UserFile.Path);
    }

    get Size(): number
    {
        return this.Files.length;
    }

    Clear()
    {
        this.Files = [];
    }

    Remove(UserFile: Types.IFile)
    {
        let index = this.Files.indexOf(UserFile);
        if (index !== -1)
            this.Files.splice(index, 1);
    }

    Add(UserFile: Types.IFile)
    {
        if (TypeInfo.Assigned(UserFile.Id)
            && UserFile.Id.length > 0
            && this.Files.indexOf(UserFile) === -1)
            this.Files.push(UserFile);
    }

    Update(Index: number, UserFile: Types.IFile)
    {
        if (Index > this.Size || Index < 0)
            return;

        this.Files[Index] = UserFile;
    }
}

export class TItem extends TAssignable implements Types.IItem
{
    static CreateNew(TypeId: Types.TItemTypeId): TItem
    {
        switch (TypeId)
        {
            case Types.TItemTypeId.Package:
                return new TPackage();
            case Types.TItemTypeId.Product:
                return new TProduct();
        }
    }

    get PictureList(): TFileList
    {
        if (! TypeInfo.Assigned(this._PictureList))
            this._PictureList = new TFileList(this.Pictures as Array<Types.IPicture>);

        return this._PictureList;
    }

    get PictureUrls()
    {
        return this.PictureList.Paths;
    }

    GetUploadProp(): Object
    {
        let Prop = {};
        if (this.Id.length > 0)
            Prop['Id'] = this.Id;
        if (this.Name.length > 0)
            Prop['Name'] = this.Name;
        if (this.AvatarUrl.length > 0)
            Prop['AvatarUrl'] = this.AvatarUrl;

        Prop['TypeId'] = this.TypeId;
        Prop['Pictures'] = this.Pictures.map((Picture) => Picture.Id);
        return Prop;
    }

    toString()
    {
        return JSON.stringify(this.GetUploadProp());
    }

    get DefaultPricing(): Types.IPricing
    {
        return null;
    }

    Id: string = '';
    TypeId: Types.TItemTypeId = 0;
    Name: string = '';
    Pictures: Array<Types.IPicture> = [];
    AvatarUrl: string = null;
    Timestamp: any;

    PricingList: Array<Types.IPricing> = [];

    protected _PictureList: TFileList;
}

export class TProduct extends TItem implements Types.IProduct
{
    constructor()
    {
        super();
    }

    TypeId = Types.TItemTypeId.Product;
}

export class TPackage extends TItem implements Types.IPackage
{
    Add(ProductOrId: string | TItem, Qty: number)
    {
        if (ProductOrId instanceof TProduct)
            ProductOrId = ProductOrId.Id;
        this.ProductInfoList.push({Product: ProductOrId, Qty: Qty});
    }

    Remove(ProductOrId: string | TItem)
    {
        let Idx = this.GetProductIndex(ProductOrId);
        if (Idx !== -1)
            this.ProductInfoList.splice(Idx, 1);
    }

    Update(ProductOrId: string | TItem, Qty: number)
    {
        let Idx = this.GetProductIndex(ProductOrId);
        if (Idx !== -1)
            this.ProductInfoList[Idx].Qty = Qty;
    }

    // override
    GetUploadProp(): Object
    {
        let Prop = super.GetUploadProp();
        Prop['ProductInfoList'] = this.ProductInfoList;

        return Prop;
    }

    private GetProductIndex(ProductOrId: string | TItem)
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

    TypeId = Types.TItemTypeId.Package;
    ProductInfoList: Array<Types.IProductInfo> = [];
}
