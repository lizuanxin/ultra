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
            console.log(this.ImgFile, this.ArrayImgFile);

                // console.log(this.flist);
                // if (TypeInfo.Assigned(this.flist))
                // {
                //     const form = new FormData();
                //     form.append('file', this.flist[0]);
                //     this.CurProduct.Pictures.push(this.flist[0].name);
                // }
            this.UploadImage(this.ImgFile);

                // if (!TypeInfo.Assigned(data))
                // {
                //     this.Items.AppendProduct(this.CurProduct)
                //     .catch(err => console.log(err));
                // }
                // else
                // {
                //     this.Items.Update(this.CurProduct)
                //     .catch(err => console.log(err));
                // }


        })
        .catch(err => {});
    }

    UploadImage(file)
    {
        this.FileSvc.Upload(file)
        .then((v) =>
        {
            console.log(v);

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


    UpdateImageDisplay(file: any, type: number)
    {

        let imgView = document.querySelector('#image-' + type + '') as HTMLElement;
        let image = document.createElement('img');
        image.src = window.URL.createObjectURL(file);
        imgView.appendChild(image);

        if (type === 1)
        {
            this.ImgFile = file;
        }
        else {
            this.ArrayImgFile.push(file);
        }

    }



    App = window.App;
    Modal: TemplateRef<any>;


    ModalTitle: string;
    CurProduct: Types.IProduct;

    SelectAll: boolean = false;
    SelectId: Array<string> = [];


    List: Array<Types.IItem>;
    UploadedFiles: Array<Types.IFile>;
    ImgFile: any;
    ArrayImgFile = new Array<any>();
}