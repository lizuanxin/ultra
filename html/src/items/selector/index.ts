import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TItemService} from 'services/item';

import * as Types from 'services/cloud/types';
import {TItemEditorComponent} from '../editor';
import {TBasicModalView} from 'share';

@Component({selector: 'item-selector', templateUrl: './index.html'})
export class TItemSelectorComponent extends TBasicModalView implements OnInit
{
    constructor(private ItemService: TItemService)
    {
        super();
        this.Items = [];
    }

    ngOnInit()
    {
        this.Refresh();
    }

    Refresh()
    {
        this.ItemService.List().then(list =>
        {
            this.Items = list;
        })
        .catch(err => App.ShowError(err));
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

    Items: Array<Types.IItem>;
    Selected = new Set<Types.IItem>();
}
