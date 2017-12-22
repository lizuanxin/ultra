import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo, THttpClient} from 'UltraCreation/Core';

import {Types} from 'services';
import {TItemService, TItem, TProduct, TPackage} from 'services/item';
import { TProductEditComponent } from 'share/component';

@Component({selector: 'item-list', templateUrl: './index.html'})
export class ListComponent implements OnInit
{
    constructor(private ItemSvc: TItemService)
    {
    }

    ngOnInit()
    {
        this.ItemModels = [];
        this.UpdateItemList();
    }

    Remove(ItemModel: TItemModel): void
    {
        this.ItemSvc.Remove(ItemModel.Source)
            .then(() => this.UpdateItemList())
            .catch((err) => console.log(err));
    }

    ToggleSelectAll()
    {
        let Selected = ! this.AllItemSelected;
        this.ItemModels.forEach((ItemModel) => ItemModel.IsSelected = Selected);
    }

    ToggleSelect(ItemModel: TItemModel)
    {
        ItemModel.IsSelected = ! ItemModel.IsSelected;
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

    OpenProductEditModal(data?: TItem)
    {
        // this.ModalTitle = this.SetModTitle(data);
        let IsNewAdded: boolean = false;
        if (! TypeInfo.Assigned(data))
        {
            data = new TProduct();
            IsNewAdded = true;
        }

        console.log('product edit: ' + JSON.stringify(data));

        App.ShowModal(TProductEditComponent, {Product: data}, {size: 'lg'})
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

    SetModTitle(data?: TItem): string
    {
        if (!TypeInfo.Assigned(data)) return App.Translate('items.commodity.button.add') + App.Translate('items.commodity.field.goods');

        return App.Translate('items.commodity.button.edit') + App.Translate('items.commodity.field.goods');
    }

    PackToPackage()
    {
        console.log('pack to package...');
    }

    /*UpdateImageDisplay(file: FileList, type: number)
    {
        let imgView = document.querySelector('#image-' + type + '') as HTMLElement;
        if (TypeInfo.Assigned(file.length))
        {
            for (let i = 0; i < file.length; i++)
            {
                if (file[i].size > this.fileMax)
                {
                    return this.fileMaxWarning = true;
                }
                else
                {
                    let image = document.createElement('img');
                    image.src = window.URL.createObjectURL(file[i]);
                    imgView.appendChild(image);
                }
            }
            type === 1 ? Object.assign(this.ArrAvatarFile, file) : Object.assign(this.ArrPictureFile, file);
        }
    }*/

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

    App = window.App;
    Modal: TemplateRef<any>;

    ItemModels: Array<TItemModel>;
    ModalTitle: string;
    CurrEditProduct: TProduct;
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
