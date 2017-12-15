import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo, THttpClient} from 'UltraCreation/Core';

import {Types} from 'services';
import {TItemService} from 'services/item';
import {TFileService} from 'services/file';

@Component({selector: 'item-list', templateUrl: './index.html'})
export class ListComponent implements OnInit
{
    constructor(private Items: TItemService, private FileSvc: TFileService)
    {
    }

    ngOnInit()
    {
        this.Refresh();
    }

    async Refresh()
    {
        this.List = await this.Items.List().catch(err =>
        {
            return null;
        });
        console.log(this.List);

    }


    Remove(data: Types.IItem): void
    {
        this.Items.Remove(data);
    }

    ToggleSelectAll()
    {
        this.List.forEach(item =>
        {
            if (this.SelectAll)
            {
                item['selected'] = true;
                if (this.SelectId.indexOf(item.Id) === -1) this.SelectId.push(item.Id);
            }
            else {
                item['selected'] = false;
                this.SelectId = [];
            }
        });
    }

    ToggleSelectId(item)
    {
        item['selected'] ? this.SelectId.push(item.Id) : this.SelectId.splice(this.SelectId.indexOf(item.Id), 1);

        if (this.SelectId.length === this.List.length)
            this.SelectAll = true;
        else
            this.SelectAll = false;
    }

    OnPackage()
    {
        console.log(this.SelectId);

    }

    OpenModal(template: TemplateRef<any>, data?: Types.IItem)
    {
        this.ModalTitle = this.SetModTitle(data);
        if (!TypeInfo.Assigned(data))
        {
            this.CurProduct = new Object() as any;
        }
        else
        {
            this.CurProduct = data;
        }

        App.Modal.open(template, {size: 'lg'}).result
        .then(ok =>
        {
            this.CurProduct.Pictures = [];
            if (this.ArrayImgFile_fir.length > 0) this.UploadImage(this.ArrayImgFile_fir, 1);
            if (this.ArrayImgFile_sec.length > 0) this.UploadImage(this.ArrayImgFile_sec, 2);

            console.log(this.CurProduct);

            if (!TypeInfo.Assigned(data))
            {
                this.Items.AppendProduct(this.CurProduct)
                .catch(err => console.log(err));
            }
            else
            {
                this.Items.Update(this.CurProduct)
                .catch(err => console.log(err));
            }


        })
        .catch(err => {});
    }

    UploadImage(file, type: number)
    {
        this.FileSvc.Upload(file)
        .then(v =>
        {
            if (type === 1) this.CurProduct.AvatarUrl = v[0].Path;
            if (type === 2) {
                v.forEach(item => this.CurProduct.Pictures.push(item.Path));
            }
        })
        .catch(err => console.log(err));
    }

    private UpdateFileList()
    {
        this.UploadedFiles = [];
        this.FileSvc.List()
            .then((List) => this.UploadedFiles = List)
            .catch((err) => console.log(err));
    }

    SetModTitle(data?: Types.IItem): string
    {
        if (!TypeInfo.Assigned(data)) return App.Translate('items.commodity.button.add') + App.Translate('items.commodity.field.goods');

        return App.Translate('items.commodity.button.edit') + App.Translate('items.commodity.field.goods');
    }


    UpdateImageDisplay(file: FileList, type: number)
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
            type === 1 ? Object.assign(this.ArrayImgFile_fir, file) : Object.assign(this.ArrayImgFile_sec, file);
        }
    }

    getFileData(file: any)
    {
        console.log('knnk');
    }



    App = window.App;
    Modal: TemplateRef<any>;


    ModalTitle: string;
    CurProduct: Types.IProduct;

    SelectAll: boolean = false;
    SelectId: Array<string> = [];


    List: Array<Types.IItem>;
    UploadedFiles: Array<Types.IFile>;
    fileMax: number = 1048576 / 2;
    fileMaxWarning: boolean;
    ArrayImgFile_fir = new Array<any>();
    ArrayImgFile_sec = new Array<any>();
}
