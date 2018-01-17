import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TRestClient} from 'UltraCreation/Core/Http';
import {TAssignable} from 'UltraCreation/Core/Persistable';

import * as Types from './cloud/types';
import {TAuthService} from './authorize';
import {IItem, TItemTypeId, IProduct, IPackage, IProductInfo} from './cloud/types/item';

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
            const ary: Array<IItem> = await this.Http.Get('/item').toPromise().then(res => res.Content);

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

    async CreateProduct(): Promise<Types.IProduct>
    {
        return new TProduct();
    }

    async CreatePackage(Products: Array<IProduct>): Promise<Types.IPackage>
    {
        const RetVal = new TPackage();

        Products.forEach(iter => RetVal.AddProduct(iter, 1));
        return RetVal;
    }

    async Save(item: IItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        if (item.Pictures.length > 0)
            item.AvatarUrl = (item.Pictures[0] as Types.IPicture).Path;
        else
            item.AvatarUrl = '';

        if (! TypeInfo.Assigned(item.Id))
        {
            const res = await this.Http.Post('/item/append', item.toString()).toPromise();
            item.Id = res.Content.Id;
            this.ItemsSnap.set(item.Id, item as TItem);
        }
        else
            await this.Http.Put('/item/update', item.toString()).toPromise();
    }

    async Remove(item: IItem): Promise<void>
    {
        this.Auth.Grant(this.Http);

        await this.Http.Post('/item/remove', {Id: item.Id, TypeId: item.TypeId}).toPromise();
        this.ItemsSnap.delete(item.Id);
    }

    async Publish(DomainId: Types.TIdentify, Items: Array<IItem>)
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

/** extends module */

declare module './cloud/types/item'
{
    interface IItem
    {
        readonly IsProduct: boolean;
        readonly IsPackage: boolean;

        AddPictures(Picture: Array<Types.IPicture>): void;
        AddPricing(Pricing: Types.ILocalizedPricing): void;

        RemovePricing(RegionName: Types.TRegionName): void;
    }

    interface IProduct
    {
    }

    interface IPackage
    {
        AddProduct(ProductOrPackage: IProduct | IPackage, Qty: number): void;
    }
}

/** TItem */

class TItem extends TAssignable implements IItem
{
    protected constructor(public TypeId: Types.TItemTypeId)
    {
        super();
    }

    get IsProduct(): boolean
    {
        return this.TypeId === Types.TItemTypeId.Product;
    }

    get IsPackage(): boolean
    {
        return this.TypeId === Types.TItemTypeId.Package;
    }

    AddPictures(Picture: Array<Types.IPicture>): void
    {
        Picture.forEach(iter =>
        {
            if (this.IndexOfPicture(iter) === -1)
                this.Pictures.push(iter);
        });
    }

    AddPricing(Pricing: Types.ILocalizedPricing): void
    {
        this.RemovePricing(Pricing.Region);
        this.PricingList.push(Pricing);
    }

    RemovePricing(RegionName: Types.TRegionName): void
    {
        const Idx = this.IndexOfPricing(RegionName);
        if (Idx !== -1)
            this.PricingList.splice(Idx, 1);
    }

    protected AfterAssignProperties(): void /**@override */
    {
        super.AfterAssignProperties();
    }

    private IndexOfPicture(f: Types.IPicture): number
    {
        for (let I = 0; I < this.Pictures.length; I ++)
        {
            if ((this.Pictures[I] as Types.IPicture).Id === f.Id)
                return I;
        }
        return -1;
    }

    private IndexOfPricing(RegionName: Types.TRegionName): number
    {
        for (let I = 0; I < this.PricingList.length; I ++)
        {
            if (this.PricingList[I].Region === RegionName)
                return I;
        }
        return -1;
    }

    Id: Types.TIdentify = null;
    Category_Id: string = null;

    Name: string = '';
    AvatarUrl: string = null;
    Html: string = null;
    ExtraProp: any | TypeInfo.TKeyValueHash<string> = {};

    Pictures: Array<Types.IPicture | Types.TIdentify> = [];
    PricingList: Array<Types.ILocalizedPricing> = [];

    readonly Timestamp: Date;

/* Object */

    valueOf(): this /** @override */
    {
        for (let I = this.PricingList.length - 1; I >= 0; I --)
        {
            const Pricing = this.PricingList[I];

            if (! TypeInfo.Assigned(Pricing.Retail) &&
                ! TypeInfo.Assigned(Pricing.Distribute) &&
                ! TypeInfo.Assigned(Pricing.Bulk))
            {
                this.PricingList.splice(I, 1);
                continue;
            }

            if (TypeInfo.Assigned(Pricing.Bulk) && ! TypeInfo.Assigned(Pricing.BulkCount))
                Pricing.BulkCount = 1000;
        }

        const RetVal = Object.assign({}, this);

        if (! TypeInfo.IsString(this.ExtraProp))
            RetVal.ExtraProp = JSON.stringify(RetVal.ExtraProp);

        RetVal.Pictures = RetVal.Pictures.map(iter => (iter as Types.IPicture).Id);
        return RetVal;
    }

    toString() /** @override */
    {
        return JSON.stringify(this.valueOf());
    }
}

/* TProduct */

class TProduct extends TItem implements IProduct
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

/* TPackage */

class TPackage extends TItem implements IPackage
{
    constructor()
    {
        super(TItemTypeId.Package);
    }

    AddProduct(ProductOrPackage: IProduct | IPackage, Qty: number)
    {
        if (ProductOrPackage instanceof TProduct)
            this.ProductInfoList.push({Product: ProductOrPackage, Qty: Qty});
        else if (ProductOrPackage instanceof TPackage)
            this.ProductInfoList = this.ProductInfoList.concat(ProductOrPackage.ProductInfoList);
    }

    ProductInfoList: Array<IProductInfo> = [];

/* object */

    valueOf(): this /** @override */
    {
        const RetVal = super.valueOf();
        RetVal.ProductInfoList = RetVal.ProductInfoList.map(iter =>
        {
            return {Product: (iter.Product as IProduct).Id, Qty: iter.Qty};
        });
        return RetVal;
    }
}
