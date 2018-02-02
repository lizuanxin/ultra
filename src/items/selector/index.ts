import {Component, EventEmitter, Input, Output} from '@angular/core';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TBasicModalView} from 'share/component/basicmodal';

import * as Types from 'services/cloud/types';

@Component({selector: 'item-selector', templateUrl: './index.html'})
export class TItemSelectorComponent extends TBasicModalView
{
    OnInit()
    {
        /*
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
        */
    }

    SetModalParams(params: any)
    {
        console.log(params);
    }

    ToggleSelect(item: Types.IItem)
    {
    }

    ToggleSelectAll()
    {
        /*
        const Selected = ! this.AllItemSelected;
        this.ItemModels.forEach((ItemModel) => ItemModel.IsSelected = Selected);
        */
    }

    ButtonCancel()
    {
        console.log('button cancel');
        this.Close(null);
    }

    ButtonOK()
    {
        /*
        console.log('button ok');
        const SelectedItems = [];
        this.ItemModels.forEach((ItemModel) =>
        {
            if (ItemModel.IsSelected)
                SelectedItems.push(ItemModel.Source);
        });
        this.Close(SelectedItems);
        */
    }

    Selected = new Set<Types.IItem>();
    @Input() Items: Array<Types.IItem> = [];
}
