import {Component, EventEmitter, Input, Output} from '@angular/core';

import {TItemService, TItem, TProduct, TPackage} from 'services/item';
import { TFileLibComponent } from 'share/component/filelib';
import { TypeInfo } from 'UltraCreation/Core/TypeInfo';
import * as Types from 'services/cloud/types';
import { TBasicModalCompnent } from 'share/component/basicmodal';
import { TItemEditComponent } from 'items/edit';

@Component({selector: 'item-list', templateUrl: './index.html'})
export class TItemListComponent extends TBasicModalCompnent
{
    constructor(private ItemSvc: TItemService)
    {
        super();
        this.ItemModels = [];
    }

    OnInit()
    {
        this.Refresh();
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
        let Selected = ! this.AllItemSelected;
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
        let SelectedItems = [];
        this.ItemModels.forEach((ItemModel) =>
        {
            if (ItemModel.IsSelected)
                SelectedItems.push(ItemModel.Source);
        });
        this.Close(SelectedItems);
    }

    CreateNewProduct()
    {
        let Product = TItem.CreateNew(Types.TItemTypeId.Product);
        this.ShowItemEditModal(Product, true);
    }

    CreateNewPackage()
    {
        let Package = TItem.CreateNew(Types.TItemTypeId.Package) as TPackage;
        this.ItemModels.forEach(item =>
        {
            if (item.IsSelected)
                Package.Add(item.Source.Id, 1);
        });

        this.ShowItemEditModal(Package, true);
    }

    EditItem(Item: TItem)
    {
        this.ShowItemEditModal(Item, false);
    }

    ShowItemEditModal(Item: TItem, IsNewCreated: boolean)
    {
        App.ShowModal(TItemEditComponent, {Item: Item}, {size: 'lg'})
            .then((EditedItem) =>
            {
                console.log('modal result: ' + JSON.stringify(EditedItem));
                if (! TypeInfo.Assigned(EditedItem))
                    return;
                let ItemPromise;
                if (IsNewCreated)
                    ItemPromise = this.ItemSvc.Append(EditedItem);
                else
                    ItemPromise = this.ItemSvc.Update(EditedItem);

                ItemPromise
                    .then(() => this.Refresh())
                    .catch((err) => console.log(err));
            });
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
            .then(() => this.Refresh())
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

    private Refresh()
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
        console.log('selected: ' + Selected);
        if (Selected)
            TItemModel.SelectedNum ++;
        else
            TItemModel.SelectedNum --;

        this._IsSelected = Selected;
    }

    _IsSelected: boolean = false;
}


