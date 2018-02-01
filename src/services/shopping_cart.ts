import {Injectable} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';

import * as Types from './cloud/types';
import { TDomainService } from 'services/domain';

@Injectable()
export class TShoppingCart
{
    constructor(private DomainSvc: TDomainService)
    {
    }

    async Init()
    {
        if (! TypeInfo.Assigned(this.RevertingCache))
            this.RevertingCache = this.RevertFromLocalCache();

        return await this.RevertingCache;
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
        this.Selected.clear();
        this.BackupManifestsToLocalCache();
        this.BackupSelectedToLocalCache();
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
        this.BackupManifestsToLocalCache();
    }

    Update(Manifest: Types.IManifest)
    {
        Manifest.Price = this.SubtotalOf(Manifest);
        this.BackupManifestsToLocalCache();
    }

    SelectionChanged(Selected: boolean, Manifest: Types.IManifest)
    {
        if (Selected)
            this.Selected.add(Manifest);
        else
            this.Selected.delete(Manifest);

        this.BackupSelectedToLocalCache();
    }

    Remove(Manifest: Types.IManifest)
    {
        this.SelectionChanged(false, Manifest);
        this.ItemCache.delete(Manifest.Id);
        this.BackupManifestsToLocalCache();
    }

    private async RevertFromLocalCache()
    {
        console.log('Load shopping item from cache...');
        this.ItemCache.clear();
        this.Selected.clear();
        const Manifests = JSON.parse(localStorage.getItem('last_manifest_items')) as Array<Types.IManifest>;
        const SelectedIds = JSON.parse(localStorage.getItem('last_selected_ids')) as Array<Types.TIdentify>;
        await this.UpdateManifestsFromServer(Manifests);
        this.RevertSelectedWith(SelectedIds);
        this.BackupManifestsToLocalCache();
        this.BackupSelectedToLocalCache();
    }

    private BackupManifestsToLocalCache()
    {
        localStorage.setItem('last_manifest_items', JSON.stringify(Array.from(this.ItemCache.values())));
    }

    private BackupSelectedToLocalCache()
    {
        const SelectedIds = Array.from(this.Selected.values()).map((Manifest) => Manifest.Id);
        console.log(JSON.stringify(SelectedIds));
        localStorage.setItem('last_selected_ids', JSON.stringify(SelectedIds));
    }

    private async UpdateManifestsFromServer(Manifests: Array<Types.IManifest>)
    {
        for (let Manifest of Manifests)
        {
            try
            {
                const NewManifest = (await this.DomainSvc.Open(Manifest.Id)) as Types.IManifest;
                if (TypeInfo.Assigned(NewManifest))
                {
                    NewManifest.Qty = Manifest.Qty;
                    NewManifest.Memo = Manifest.Memo;
                    NewManifest.Price = this.SubtotalOf(NewManifest);
                    this.ItemCache.set(NewManifest.Id, NewManifest);
                }
            }
            catch (err)
            {
                console.log(err);
            }
        }
    }

    private async RevertSelectedWith(Ids: Array<Types.TIdentify>)
    {
        for (let Id of Ids)
        {
            const Manifest = this.ItemCache.get(Id);
            if (TypeInfo.Assigned(Manifest))
                this.Selected.add(Manifest);
        }
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
    protected RevertingCache: Promise<void>;
}
