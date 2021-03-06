import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TItemService} from 'services/item';
import {NgbModal} from 'share/modal';

import * as Types from 'services/cloud/types';
import {TItemEditorComponent} from '../editor';

@Component({selector: 'item-list', templateUrl: './index.html'})
export class TItemListComponent implements OnInit
{
    constructor(private ItemService: TItemService, private Modal: NgbModal)
    {
        this.Items = [];
    }

    ngOnInit()
    {
        this.ItemService.Regions()
            .then(list => this.Regions = list)
            .catch(err => console.log(err));

        this.ItemService.Domains()
            .then(list => this.Domains = list)
            .catch(err => console.log(err));

        this.Refresh();
    }

    Refresh()
    {
        this.ItemService.List()
            .then(list => this.Items = list)
            .catch(err => App.ShowError(err));
    }

    CreateNewProduct()
    {
        this.ItemService.CreateProduct()
            .then(product => this.OpenModal(product));
    }

    CreateNewPackage()
    {
        this.ItemService.CreatePackage(Array.from(this.Selected.values()))
            .then(pkg => this.OpenModal(pkg));
    }

    Edit(Item: Types.IItem)
    {
        this.OpenModal(Item);
    }

    Remove(item: Types.IItem): void
    {
        this.ItemService.Remove(item)
            .then(() => this.Refresh())
            .catch(err => App.ShowError(err));
    }

    Publish(domain: Types.IDomain)
    {
        console.log(domain);
        return this.ItemService.Publish(domain.Id, Array.from(this.Selected.values()));
    }

    ToggleSelectAll()
    {
        if (this.Selected.size < this.Items.length)
            this.Items.forEach(iter => this.Selected.add(iter));
        else
            this.Selected.clear();
    }

    ToggleSelect(Item: Types.IItem)
    {
        if (this.Selected.has(Item))
            this.Selected.delete(Item);
        else
            this.Selected.add(Item);
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

    private OpenModal(Item: Types.IItem): Promise<any>
    {
        return this.Modal.Open(TItemEditorComponent, {Regions: this.Regions, Item: Item, Items: this.Items}, {size: 'lg'}).result
            .then(RetVal =>
            {
                if (! TypeInfo.Assigned(RetVal))
                    return;

                this.ItemService.Save(RetVal)
                    .then(() => this.Refresh())
                    .catch(err => App.ShowError(err));
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
    Domains: Array<Types.IDomain>;

    Items: Array<Types.IItem>;
    Selected = new Set<Types.IItem>();
}
