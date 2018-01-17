import {Component, EventEmitter, Input, Output} from '@angular/core';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TBasicModalView} from 'share/component/basicmodal';

import * as Types from 'services/cloud/types';
import {TItemService} from 'services/item';

@Component({selector: 'item-selector', templateUrl: './selector.html'})
export class TItemSelectorComponent extends TBasicModalView
{
    constructor(private ItemSvc: TItemService)
    {
        super();
        this.ItemModels = [];
    }

    OnInit()
    {
        TItemModel.SelectedNum = 0;
        console.log(JSON.stringify(this.FilterItems) + ' ' + this.FilterType);
        this.ItemSvc.List().then((ItemList) =>
        {
            for (const Item of ItemList)
            {
                if (! this.IsNeedToFiltered(Item))
                    this.ItemModels.push(new TItemModel(Item));
            }
        });
    }

    OnClosed(Data: any)
    {
        this.Close(null);
    }

    OnDismiss(Data: any)
    {
    }

    ToggleSelect(ItemModel: TItemModel)
    {
        if (ItemModel.IsSelected === undefined)
            ItemModel.IsSelected = false;
        ItemModel.IsSelected = ! ItemModel.IsSelected;
    }

    ToggleSelectAll()
    {
        const Selected = ! this.AllItemSelected;
        this.ItemModels.forEach((ItemModel) => ItemModel.IsSelected = Selected);
    }

    ButtonCancel()
    {
        console.log('button cancel');
        this.Close(null);
    }

    ButtonOK()
    {
        console.log('button ok');
        const SelectedItems = [];
        this.ItemModels.forEach((ItemModel) =>
        {
            if (ItemModel.IsSelected)
                SelectedItems.push(ItemModel.Source);
        });
        this.Close(SelectedItems);
    }

    get AllItemSelected(): boolean
    {
        if (this.ItemModels.length === 0)
            return false;

        return TItemModel.SelectedNum === this.ItemModels.length;
    }

    get NullItemSelected(): boolean
    {
        return TItemModel.SelectedNum === 0;
    }

    get SelectedItemNum(): number
    {
        return TItemModel.SelectedNum;
    }

    private IsNeedToFiltered(Item: Types.IItem)
    {
        for (const FilterItemId of this.FilterItems)
        {
            if (FilterItemId === Item.Id ||
                this.FilterType === Item.TypeId)
                return true;
        }
        return false;
    }

    ItemModels: Array<TItemModel>;

    @Input() FilterItems: Array<Types.TIdentify> = [];
    @Input() FilterType: Types.TItemTypeId = Types.TItemTypeId.Package;
}

export class TItemModel
{
    static SelectedNum: number = 0;
    constructor(public Source: Types.IItem)
    {
    }

    get IsSelected(): boolean
    {
        return this._IsSelected;
    }

    set IsSelected(Selected: boolean)
    {
        if (this._IsSelected === Selected)
            return;

        if (Selected)
            TItemModel.SelectedNum ++;
        else
            TItemModel.SelectedNum --;

        this._IsSelected = Selected;
    }

    _IsSelected: boolean = false;
}
