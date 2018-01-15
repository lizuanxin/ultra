import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TItemService, TItem, TProduct, TPackage} from 'services/item';
import {TFileLibComponent} from 'share/component/filelib';

import * as Types from 'services/cloud/types';
import {TItemEditorComponent} from '../editor';
import { DomainComponent } from 'share/component';

@Component({selector: 'item-list', templateUrl: './index.html'})
export class TItemListComponent implements OnInit
{
    App = window.App;
    constructor(private ItemSvc: TItemService)
    {
        this.ItemModels = [];
    }

    ngOnInit()
    {
        this.Refresh();
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

    CreateNewProduct()
    {
        let Product = TItem.CreateNew(Types.TItemTypeId.Product);
        this.ShowItemEditModal(Product, true);
        // App.ShowAlert({ Message: 'Test alert',

        //     Buttons: [
        //         {
        //             Text: 'Cancel',
        //             Class: 'btn-outline-secondary',
        //             Handler: (data) => { console.log('cancel clicked'); }
        //         },
        //         {
        //             Text: 'OK',
        //             Class: 'btn-primary',
        //             Handler: (data) => { console.log('ok clicked' + JSON.stringify(data)); }
        //         }
        //     ]});
        // App.ShowToast('info', 'woerjoewr');
    }

    CreateNewPackage()
    {
        let Package = TItem.CreateNew(Types.TItemTypeId.Package) as TPackage;
        this.ItemModels.forEach(item =>
        {
            if (item.IsSelected && item.Source.TypeId !== Types.TItemTypeId.Package)
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
        App.ShowModal(TItemEditorComponent, {Item: Item}, {size: 'lg'})
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

    async PublishItems()
    {
        let Domains = await App.ShowModal(DomainComponent, {}, {size: 'lg'});
        if (TypeInfo.Assigned(Domains))
        {
            for (let Domain of Domains)
            {
                await this.ItemSvc.Publish(Domain.Id, this.SelectedItemModels.map((ItemModel) => ItemModel.Source));
            }
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
            .then(() => this.Refresh())
            .catch((err) => console.log(err));
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

    get SelectedItemModels(): Array<TItemModel>
    {
        return this.ItemModels.filter((ItemModel) => ItemModel.IsSelected);
    }

    private Refresh()
    {
        this.ItemSvc.List()
            .then((ItemList) =>
            {
                console.log('update item: ' + ItemList.length);
                TItemModel.SelectedNum = 0;
                this.ItemModels = ItemList.map((Item) => new TItemModel(Item));

            })
            .catch((err) => console.log(err));
    }

    ItemModels: Array<TItemModel>;
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


