import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TRestClient} from 'UltraCreation/Core/Http';
import {TAssignable} from 'UltraCreation/Core/Persistable';

import * as Types from './cloud/types';
import {TAuthService} from './authorize';
import {TItemTypeId} from './cloud/types';

@Injectable()
export class TItemService
{
    constructor(private Auth: TAuthService)
    {
    }

    async Regions(): Promise<Array<Types.IRegion>>
    {
        if (! TypeInfo.Assigned(this.RegionsSnap))
            this.RegionsSnap = await this.Http.Get('/publish/regions').toPromise().then((res) => res.Content);

        return this.RegionsSnap;
    }

    async Domains(): Promise<Array<Types.IDomain>>
    {
        if (! TypeInfo.Assigned(this.DomainsSnap))
        {
            const ary = await this.Http.Get('/publish/domains').toPromise().then(res => res.Content);
            this.DomainsSnap = new Map<Types.TIdentify, Types.IDomain>();
            ary.forEach(iter => this.DomainsSnap.set(iter.Id, iter));
        }

        return Array.from(this.DomainsSnap.values());
    }

    async List(): Promise<Array<TItem>>
    {
        if (! TypeInfo.Assigned(this.ItemsSnap))
        {
            this.Auth.Grant(this.Http);
            const ary: Array<Types.IItem> = await this.Http.Get('/item').toPromise().then(res => res.Content);

            this.ItemsSnap = new Map<Types.TIdentify, TItem>();
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

    GetCached(Id: string): TItem
    {
        return this.ItemsSnap.get(Id);
    }

    async CreateProduct(): Promise<TItem>
    {
        const RetVal = new TProduct();

        const Regions = await this.Regions();
        for (const iter of Regions)
            RetVal.PricingList.push({Region: iter.Name});

        return RetVal;
    }

    async CreatePackage(Products: Array<Types.IItem>): Promise<TItem>
    {
        await this.Domains();

        const RetVal = new TPackage();

        const Regions = await this.Regions();
        for (const iter of Regions)
            RetVal.PricingList.push({Region: iter.Name});

        Products.forEach(iter => RetVal.AddProduct(iter, 1));
        return RetVal;
    }

    async Save(item: Types.IItem): Promise<void>
    {
        this.Auth.Grant(this.Http);
        if (! TypeInfo.Assigned(item.Id))
        {
            const res = await this.Http.Post('/item/append', item.toString()).toPromise();
            item.Id = res.Content.Id;
            this.ItemsSnap.set(item.Id, item as TItem);
        }
        else
            await this.Http.Put('/item/update', item.toString()).toPromise();
    }

    async Remove(item: Types.IItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        await this.Http.Post('/item/remove', {Id: item.Id, TypeId: item.TypeId}).toPromise();
        this.ItemsSnap.delete(item.Id);
    }

    async Publish(DomainId: Types.TIdentify, Items: Array<Types.IItem>)
    {
        const ItemsId = Items.map((Item) =>
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

    /**
     *  Get published item
     *  @param Domain_Id
     *      returns User owned items if null
     */
    async Published(Domain_Id?: string): Promise<Array<Types.IPublished>>
    {
        if (TypeInfo.Assigned(Domain_Id))
        {
            console.log('list domain items');
        }
        else
        {
            if (! TypeInfo.Assigned(this.PublishedSnap))
            {
                await this.Domains();
                await this.List();

                const Ary: Types.IPublished[] =
                    await this.Http.Get('/publish/', {Domain_Id: 'kktYWb9kklZYlL8k'}).toPromise().then((res) => res.Content);
                this.PublishedSnap = new Map<Types.TIdentify, Types.IPublished>();

                for (const Iter of Ary)
                {
                    Iter.Item = this.ItemsSnap.get(Iter.Item as Types.TIdentify);
                    Iter.Domain = this.DomainsSnap.get(Iter.Domain as Types.TIdentify);

                    this.PublishedSnap.set(Iter.Id, Iter);
                }
            }

            return Array.from(this.PublishedSnap.values());
        }
    }

    private Http = new TRestClient('/api');

    private RegionsSnap: Array<Types.IRegion>;
    private DomainsSnap: Map<Types.TIdentify, Types.IDomain>;
    private ItemsSnap: Map<Types.TIdentify, TItem>;
    private PublishedSnap: Map<Types.TIdentify, Types.IPublished>;
}

export class TItem extends TAssignable implements Types.IItem
{
    protected constructor(TypeId: Types.TItemTypeId)
    {
        super();
        this.TypeId = TypeId;
    }

    get IsProduct(): boolean
    {
        return this.TypeId === Types.TItemTypeId.Product;
    }

    get IsPackage(): boolean
    {
        return this.TypeId === Types.TItemTypeId.Package;
    }

    AddPictures(Picture: Array<Types.IPicture>)
    {
        Picture.forEach(iter =>
        {
            if (this.IndexOfPicture(iter) === -1)
                this.Pictures.push(iter);
        });
    }

    IndexOfPicture(f: Types.IPicture): number
    {
        for (let I = 0; I < this.Pictures.length; I ++)
        {
            if (this.Pictures[I].Id === f.Id)
                return I;
        }
        return -1;
    }

    GetUploadProp(): Object
    {
        const Prop = {};
        if (this.Id.length > 0)
            Prop['Id'] = this.Id;
        if (this.Name.length > 0)
            Prop['Name'] = this.Name;
        if (TypeInfo.Assigned(this.AvatarUrl) && this.AvatarUrl.length > 0)
            Prop['AvatarUrl'] = this.AvatarUrl;
        if (TypeInfo.Assigned(this.Html) && this.Html.length > 0)
            Prop['Html'] = this.Html;

        Prop['TypeId'] = this.TypeId;
        Prop['Pictures'] = this.Pictures.map(Picture => Picture.Id);
        Prop['PricingList'] = this.PricingList;
        return Prop;
    }

    toString()
    {
        return JSON.stringify(this.GetUploadProp());
    }

    Id: Types.TIdentify = null;
    TypeId: Types.TItemTypeId = null;
    Category_Id: string = null;

    Name: string = '';
    AvatarUrl: string = null;
    Html: string = null;
    ExtraProp: any = null;

    Pictures: Array<Types.IPicture> = [];
    PricingList: Array<Types.ILocalizedPricing> = [];

    readonly Timestamp: Date;
}

export class TProduct extends TItem implements Types.IProduct
{
    constructor()
    {
        super(TItemTypeId.Product);
    }

    Model?: string;
    Unit?: string;
    Height?: number;
    Width?: number;
    Depth?: number;
    Weight?: number;
}

export class TPackage extends TItem implements Types.IPackage
{
    constructor()
    {
        super(TItemTypeId.Package);
    }

    AddProduct(ProductOrPackage: Types.IProduct | Types.IPackage, Qty: number)
    {
        if (ProductOrPackage instanceof TProduct)
            this.ProductInfoList.push({Product: ProductOrPackage, Qty: Qty});
        else if (ProductOrPackage instanceof TPackage)
            this.ProductInfoList = this.ProductInfoList.concat(ProductOrPackage.ProductInfoList);
    }

    // override
    GetUploadProp(): Object
    {
        const Prop = super.GetUploadProp();
        Prop['ProductInfoList'] = this.ProductInfoList;

        return Prop;
    }

    ProductInfoList: Array<Types.IProductInfo> = [];
}
