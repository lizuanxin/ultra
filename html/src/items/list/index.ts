import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TItemService} from 'services/item';
import {TFileLibComponent} from 'share/component/filelib';

import * as Types from 'services/cloud/types';
import {TItemEditorComponent} from '../editor';
import {DomainComponent} from 'share/component';

@Component({selector: 'item-list', templateUrl: './index.html'})
export class TItemListComponent implements OnInit
{
    constructor(private ItemSvc: TItemService)
    {
        this.Items = [];
    }

    ngOnInit()
    {
        this.ItemSvc.Regions()
            .then(list => this.Regions = list)
            .catch(err => console.log(err));

        this.Refresh();
    }

    CreateNewProduct()
    {
        this.ItemSvc.CreateProduct()
            .then(product => this.OpenModal(product));
    }

    CreateNewPackage()
    {
        this.ItemSvc.CreatePackage(Array.from(this.Selected.values()))
            .then(pkg => this.OpenModal(pkg));
    }

    Edit(Item: Types.IItem)
    {
        this.OpenModal(Item);
    }

    Remove(item: Types.IItem): void
    {
        this.ItemSvc.Remove(item)
            .then(() => this.Refresh())
            .catch((err) => console.log(err));
    }

    async Publish()
    {
        const Domains = await App.ShowModal(DomainComponent, {}, {size: 'lg'});

        if (TypeInfo.Assigned(Domains))
        {
            for (const Domain of Domains)
                await this.ItemSvc.Publish(Domain.Id, Array.from(this.Selected.values()));
        }
    }

    ToggleSelectAll()
    {
        if (this.Selected.size < this.Items.length)
            this.Items.forEach(iter => this.Selected.add(iter));
        else
            this.Selected.clear();
    }

    get IsSelectedAll(): boolean
    {
        return this.Items.length > 0 && this.Selected.size === this.Items.length;
    }

    SelectionChanged(Selected: boolean, Item: Types.IItem)
    {
        if (Selected)
            this.Selected.add(Item);
        else
            this.Selected.delete(Item);
    }

    private Refresh()
    {
        this.ItemSvc.List()
            .then(list => this.Items = list)
            .catch(err => console.log(err));
    }

    private OpenModal(Item: Types.IItem): Promise<any>
    {
        return App.ShowModal(TItemEditorComponent, {Regions: this.Regions, Item: Item}, {size: 'lg'})
            .then(RetVal =>
            {
                if (! TypeInfo.Assigned(RetVal))
                    return;

                this.ItemSvc.Save(RetVal)
                    .then(() => this.Refresh())
                    .catch((err) => console.log(err));
            })
            .catch(err =>
            {
                if (err instanceof Error)
                    App.ShowError(err);
                else
                    console.log(err);
            });
    }

    App = window.App;

    Regions: Array<Types.IRegion>;
    Items: Array<Types.IItem>;
    Selected = new Set<Types.IItem>();
}
