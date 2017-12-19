import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo, THttpClient} from 'UltraCreation/Core';

import {Types} from 'services';
import {TItemService, TItem, TProduct, TPackage} from 'services/item';
import {TFileService} from 'services/file';

@Component({selector: 'pic-list', templateUrl: './index.html'})
export class PicturesComponent implements OnInit
{
    constructor(private Items: TItemService, private FileSvc: TFileService)
    {
    }

    ngOnInit()
    {


    }

    UploadImage(file, type: number)
    {
        this.FileSvc.Upload(file)
        .then(v =>
        {

        })
        .catch(err => console.log(err));
    }

    private UpdateFileList()
    {
        this.FileSvc.List()
            .then((List) => this.UploadedFiles = List)
            .catch((err) => console.log(err));
    }

    UploadedFiles: Array<Types.IFile>;

}
