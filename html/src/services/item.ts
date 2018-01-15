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
        return this.ItemsSnap.get(ItemId);
    }

    async Regions()
    {
        if (! TypeInfo.Assigned(this.RegionsSnap))
            this.RegionsSnap = await this.Http.Get('/publish/regions').toPromise().then((res) => res.Content);

        return this.RegionsSnap;
    }

    async Domains()
    {
        if (! TypeInfo.Assigned(this.DomainsSnap))
            this.DomainsSnap = await this.Http.Get('/publish/domains').toPromise().then((res) => res.Content);

        return this.DomainsSnap;
    }

    async List(): Promise<Array<TItem>>
    {
        if (! TypeInfo.Assigned(this.ItemsSnap))
        {
            this.Auth.Grant(this.Http);
            const ary: Array<Types.IItem> = await this.Http.Get('/item').toPromise().then(res => res.Content);

            this.ItemsSnap = new Map<string, TItem>();
            for (const iter of ary)
            {
                let Item: TItem;
                if (iter.TypeId === Types.TItemTypeId.Package)
                    Item = new TPackage();
                else
                    Item = new TProduct();
                Item.Assign(iter);
                this.ItemsSnap.set(iter.Id, Item);
            }
        }

        return Array.from(this.ItemsSnap.values());
    }

    async Open(Id: number): Promise<Types.IItem>
    {
        return null;
    }

    async Append(item: TItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        console.log('append: ' + item);
        const res = await this.Http.Post('/item/append', item.toString()).toPromise();
        item.Id = res.Content.Id;

        this.ItemsSnap.set(item.Id, item);
    }

    async Update(item: TItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        const res = await this.Http.Post('/item/update', item.toString()).toPromise();
        this.ItemsSnap.set(item.Id, item);
    }

    async Remove(item: TItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        await this.Http.Post('/item/remove', {Id: item.Id, TypeId: item.TypeId}).toPromise();
        this.ItemsSnap.delete(item.Id);
    }

    async PublishedList(): Promise<Array<Types.IPublished>>
    {
        if (! TypeInfo.Assigned(this.PublishedSnap))
        {
            const Ary: Types.IPublished[] =
                await this.Http.Get('/publish/', {Domain_Id: 'kktYWb9kklZYlL8k'}).toPromise().then((res) => res.Content);
            this.PublishedSnap = new Map<string, Types.IPublished>();
            console.log(Ary);
            for (let iter of Ary)
                this.PublishedSnap.set(iter.Id, iter);
        }
        return Array.from(this.PublishedSnap.values());
    }

    async Publish(DomainId: Types.TIdentify, Items: Array<TItem | Types.TIdentify>)
    {
        let ItemsId = Items.map((Item) =>
        {
            if (TypeInfo.IsPrimitive(Item))
                return Item;
            else
                return Item.Id;
        });

        this.Auth.Grant(this.Http);
        await this.Http.Post('/publish/up', {Domain_Id: DomainId, ItemIds: ItemsId}).toPromise();
    }

    async Unpublish(Param: Types.IUnpublishing)
    {
        this.Auth.Grant(this.Http);
        await this.Http.Post('/publish/down', Param).toPromise();
    }

    private Http = new TRestClient('/api');
    private ItemsSnap: Map<string, TItem>;
    private RegionsSnap: Array<Types.IRegion>;
    private DomainsSnap: Array<Types.IDomain>;
    private PublishedSnap: Map<string, Types.IPublished>;
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
        let Idx = this.Index(UserFile);
        if (Idx !== -1)
            this.Files.splice(Idx, 1);
    }

    Add(UserFile: Types.IFile)
    {
        if (TypeInfo.Assigned(UserFile.Id)
            && UserFile.Id.length > 0
            && this.Index(UserFile) === -1)
            this.Files.push(UserFile);
    }

    Update(Idx: number, UserFile: Types.IFile)
    {
        if (Idx > this.Size || Idx < 0)
            return;

        this.Files[Idx] = UserFile;
    }

    private Index(UserFile: Types.IFile)
    {
        for (let i = 0; i < this.Files.length; i++)
        {
            if (this.Files[i].Id === UserFile.Id)
                return i;
        }
        return -1;
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

    get IsPackage(): boolean
    {
        return this.TypeId === Types.TItemTypeId.Package;
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
        if (TypeInfo.Assigned(this.AvatarUrl) && this.AvatarUrl.length > 0)
            Prop['AvatarUrl'] = this.AvatarUrl;
        if (TypeInfo.Assigned(this.Html) && this.Html.length > 0)
            Prop['Html'] = this.Html;

        Prop['TypeId'] = this.TypeId;
        Prop['Pictures'] = this.Pictures.map((Picture) => Picture.Id);
        Prop['PricingList'] = this.PricingList;
        return Prop;
    }

    toString()
    {
        return JSON.stringify(this.GetUploadProp());
    }

    Id: Types.TIdentify = '';
    TypeId: Types.TItemTypeId = 0;

    Category_Id: string = null;

    Name: string = '';
    AvatarUrl: string = null;
    Pictures: Array<Types.IPicture> = [];
    Html: string = null;
    ExtraProp: any = null;
    PricingList: Array<Types.ILocalizedPricing> = [];

    readonly Timestamp: Date;

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
