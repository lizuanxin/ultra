import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';

import * as Types from './cloud/types';

@Injectable()
export class TShoppingCart
{
    List(): Array<Types.IManifest>
    {
        return Array.from(this.ItemCache.values());
    }

    Size(): number
    {
        return this.ItemCache.size;
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

        ShoppingItem.Price = this.CalSubTotalOf(ShoppingItem);
        this.ItemCache.set(PublishedItem.Id, ShoppingItem);
    }

    Update(Id: string, Qty: number)
    {
        const ShoppingItem = this.ItemCache.get(Id);
        if (TypeInfo.Assigned(ShoppingItem))
        {
            ShoppingItem.Qty = Qty;
            ShoppingItem.Price = this.CalSubTotalOf(ShoppingItem);
        }
    }

    Remove(Id: string)
    {
        this.ItemCache.delete(Id);
    }

    private CalSubTotalOf(Item: Types.IManifest)
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

    ItemCache: Map<string, Types.IManifest> = new Map<string, Types.IManifest>();
}
