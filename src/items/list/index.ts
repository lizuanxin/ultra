import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo, THttpClient} from 'UltraCreation/Core';

import {Types} from 'services';
import {TItemService, TItem, TProduct, TPackage} from 'services/item';

@Component({selector: 'item-list', templateUrl: './index.html'})
export class ListComponent implements OnInit
{
    constructor(private ItemSvc: TItemService)
    {
    }

    ngOnInit()
    {
    }

    Remove(data: TItem): void
    {
        this.ItemSvc.Remove(data);
    }

    ToggleSelectAll()
    {
    }

    ToggleSelectId(item)
    {
    }

    OnPackage()
    {
    }

    OpenProductEditModal(template: TemplateRef<any>, data?: TItem)
    {
        this.ModalTitle = this.SetModTitle(data);
        if (! TypeInfo.Assigned(data))
        {
            this.CurrEditProduct = new Object() as any;
        }
        else
        {
            if (TypeInfo.Assigned(data.AvatarUrl)) this.ArrAvatarFile.push(data.AvatarUrl);
            if (TypeInfo.Assigned(data.Pictures)) data.Pictures.forEach(item => this.ArrPictureFile.push(item));

            this.CurrEditProduct = data;
        }

        App.Modal.open(template, {size: 'lg'}).result
            .then(ok =>
            {
                if (!TypeInfo.Assigned(data))
                {
                    this.ItemSvc.Append(this.CurrEditProduct)
                        .catch(err => console.log(err));
                }
                else
                {
                    this.ItemSvc.Update(this.CurrEditProduct)
                        .catch(err => console.log(err));
                }
            })
            .catch(err => {});
    }

    UploadImage(file, type: number)
    {
        // this.FileSvc.Upload(file)
        // .then(v =>
        // {
        //     if (type === 1) this.CurrentIProduct.AvatarUrl = v[0].Path;
        //     if (type === 2) {
        //         // v.forEach(item => this.CurrentIProduct.PictureList.Add(item.Path));
        //     }
        // })
        // .catch(err => console.log(err));
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
    constructor(public Source: TItem)
    {
    }

    IsSelected: boolean = false;
}
