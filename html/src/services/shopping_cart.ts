import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';

import * as Types from './cloud/types';

@Injectable()
export class TShoppingCart
{
    constructor()
    {
        this.LoadFromLocalCache();
    }

    LoadFromLocalCache()
    {
        const ManifestItems = JSON.parse(localStorage.getItem('last_manifest_items')) as Array<Types.IManifest>;
        if (TypeInfo.Assigned(ManifestItems))
            ManifestItems.forEach(Manifest => this.ItemCache.set(Manifest.Id, Manifest));
    }

    SaveToLocalCache()
    {
        localStorage.setItem('last_manifest_items', JSON.stringify(Array.from(this.ItemCache.values())));
    }

    List(): Array<Types.IManifest>
    {
        return Array.from(this.ItemCache.values());
    }

    Size(): number
    {
        return this.ItemCache.size;
    }

    Clear()
    {
        this.ItemCache.clear();
        this.SaveToLocalCache();
    }

    Add(PublishedItem: Types.IPublished, Qty: number = 1)
    {
        let ShoppingItem = this.ItemCache.get(PublishedItem.Id);
        if (TypeInfo.Assigned(ShoppingItem))
        {
            ShoppingItem.Qty += Qty;
        }
        else
        {
            ShoppingItem = PublishedItem as Types.IManifest;
            ShoppingItem.Qty = Qty;
        }

        ShoppingItem.Price = this.SubtotalOf(ShoppingItem);
        this.ItemCache.set(PublishedItem.Id, ShoppingItem);
        this.Selected.add(ShoppingItem);
        this.SaveToLocalCache();
    }

    Update(Manifest: Types.IManifest)
    {
        Manifest.Price = this.SubtotalOf(Manifest);
        this.SaveToLocalCache();
    }

    Remove(Manifest: Types.IManifest)
    {
        if (this.Selected.has(Manifest))
            this.Selected.delete(Manifest);
        this.ItemCache.delete(Manifest.Id);
        this.SaveToLocalCache();
    }

    private SubtotalOf(Item: Types.IManifest)
    {
        if (Item.Pricing.BulkCount > 0)
        {
            const Remainder = Item.Qty % Item.Pricing.BulkCount;
            const Multiple = (Item.Qty - Remainder) / Item.Pricing.BulkCount;
            return Multiple * Item.Pricing.Bulk + Remainder * Item.Pricing.Retail;
        }
        else
            return Item.Qty * Item.Pricing.Retail;
    }

    Selected = new Set<Types.IManifest>();
    protected ItemCache: Map<string, Types.IManifest> = new Map<string, Types.IManifest>();
}
