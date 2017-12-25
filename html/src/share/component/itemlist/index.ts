import {Component, EventEmitter, Input, Output} from '@angular/core';

import {TBasicModalCompnent} from '../basicmodal';
import {TItemService, TItem, TProduct, TPackage} from 'services/item';
import { TFileLibComponent } from 'share/component/filelib';
import { TypeInfo } from 'UltraCreation/Core/TypeInfo';
import * as Types from 'services/cloud/types';
import { TProductEditComponent } from 'share/component/productedit';

@Component({selector: 'items-list', templateUrl: './index.html'})
export class ItemListComponent extends TBasicModalCompnent
{
    constructor(private ItemSvc: TItemService)
    {
        super();
        this.ItemModels = [];
        this.UpdateItemList();
    }

    OnInit()
    {

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


        ItemModel.IsSelected = ! ItemModel.IsSelected;
    }

    ToggleSelectAll()
    {
        let Selected = ! this.AllItemSelected;
        this.ItemModels.forEach((ItemModel) => ItemModel.IsSelected = Selected);
    }

    OpenProductEditModal(data?: TItemModel)
    {
        console.log(data);
        if (!this.IsInModalMode)
        {
            let IsNewAdded: boolean = false;
            if (! TypeInfo.Assigned(data.Source))
            {
                data.Source = new TProduct();
                IsNewAdded = true;
            }

            console.log('product edit: ' + JSON.stringify(data.Source));

            App.ShowModal(TProductEditComponent, {Product: data.Source}, {size: 'lg'})
            .then((EditedProduct) =>
            {
                console.log('modal result: ' + JSON.stringify(EditedProduct));
                if (! TypeInfo.Assigned(EditedProduct))
                    return;
                let ItemPromise;
                if (IsNewAdded)
                    ItemPromise = this.ItemSvc.Append(EditedProduct);
                else
                    ItemPromise = this.ItemSvc.Update(EditedProduct);

                ItemPromise
                    .then(() => this.UpdateItemList())
                    .catch((err) => console.log(err));
            });
        }
        else
        {
            this.ToggleSelect(data);
        }

    }

    /*
    SetModTitle(data?: TItem): string
    {
        if (!TypeInfo.Assigned(data)) return App.Translate('items.commodity.button.add') + App.Translate('items.commodity.field.goods');

        return App.Translate('items.commodity.button.edit') + App.Translate('items.commodity.field.goods');
    }
    */

    Remove(ItemModel: TItemModel): void
    {
        this.ItemSvc.Remove(ItemModel.Source)
            .then(() => this.UpdateItemList())
            .catch((err) => console.log(err));
    }

    get AllItemSelected(): boolean
    {
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

    private UpdateItemList()
    {
        this.ItemSvc.List()
            .then((ItemList) =>
            {
                console.log('update item: ' + ItemList);
                TItemModel.SelectedNum = 0;
                this.ItemModels = ItemList.map((Item) => new TItemModel(Item));
            })
            .catch((err) => console.log(err));
    }

    ItemModels: Array<TItemModel>;
    ModalTitle: string;

    @Input() NavOpeation: Boolean = true;
    @Input() ItemRemove: Boolean = true;

}

export class TItemModel
{
    static SelectedNum: number = 0;
    constructor(public Source: TItem)
    {
    }

    get IsSelected(): boolean
    {
        return this._IsSelected;
    }

    set IsSelected(Selected: boolean)
    {
        if (Selected)
            TItemModel.SelectedNum ++;
        else
            TItemModel.SelectedNum --;

        this._IsSelected = Selected;
    }

    _IsSelected: boolean = false;
}


