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
        // if (! TypeInfo.Assigned(data))
        // {
        //     this.CurrEditProduct = new Object() as any;
        // }
        // else
        // {
        //     if (TypeInfo.Assigned(data.AvatarUrl)) this.ArrAvatarFile.push(data.AvatarUrl);
        //     if (TypeInfo.Assigned(data.Pictures)) data.Pictures.forEach(item => this.ArrPictureFile.push(item));

        //     this.CurrEditProduct = data;
        // }

        // App.Modal.open(template, {size: 'lg'}).result
        //     .then(ok =>
        //     {
        //         if (!TypeInfo.Assigned(data))
        //         {
        //             this.ItemSvc.Append(this.CurrEditProduct)
        //                 .catch(err => console.log(err));
        //         }
        //         else
        //         {
        //             this.ItemSvc.Update(this.CurrEditProduct)
        //                 .catch(err => console.log(err));
        //         }
        //     })
        //     .catch(err => {});

        if (! TypeInfo.Assigned(data))
            data = new TProduct();

        console.log('product edit: ' + JSON.stringify(data));

        App.ShowModal(TProductEditComponent, {Product: data}, {size: 'lg'})
            .then((Data) =>
            {
                console.log('modal result: ' + JSON.stringify(Data));
            });
    }

    SetModTitle(data?: TItem): string
    {
        if (!TypeInfo.Assigned(data)) return App.Translate('items.commodity.button.add') + App.Translate('items.commodity.field.goods');

        return App.Translate('items.commodity.button.edit') + App.Translate('items.commodity.field.goods');
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

    getFileData(obj: any)
    {

        if (obj.id === 'image_1') Object.assign(this.ArrAvatarFile, obj.filed);

        if (obj.id === 'image_2' && this.ArrPictureFile.length < this.MaxPicture)
        {
            if (this.ArrPictureFile.length === 0)
            {
                Object.assign(this.ArrPictureFile, obj.filed);
            }
            else
            {
                for (let item of obj.filed)
                {
                    this.ArrPictureFile.push(item);
                }
            }
        }
        // file.forEach(item => this.CurProduct.Pictures.push(item.Path));
    }

    private UpdateItemList()
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

    App = window.App;
    Modal: TemplateRef<any>;

    ItemModels: Array<TItemModel>;
    ModalTitle: string;
    CurrEditProduct: TProduct;

    fileMax: number = 1048576 / 2;
    fileMaxWarning: boolean;
    MaxAvatar: number = 1;
    MaxPicture: number = 5;
    ArrAvatarFile = new Array<any>();
    ArrPictureFile = new Array<any>();
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
