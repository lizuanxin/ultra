import {Component, OnInit, TemplateRef, Input, Output, EventEmitter} from '@angular/core';
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
        this.UpdateFileList();
    }

    UploadImage(file: any)
    {
        this.FileSvc.Upload(file)
            .then(() => this.UpdateFileList())
            .catch(err => console.log(err));
    }

    SelectedPicture(Picture: Types.IFile)
    {
        console.log('selected: ' + Picture.Id);
        this.SelectedFiles.set(Picture.Id, Picture);
    }

    OnSelectedEnd()
    {
        this.OnPictureSelected.emit(Array.from(this.SelectedFiles.values()));
    }

    private UpdateFileList()
    {
        this.FileSvc.List()
            .then((List) => this.UploadedFiles = List)
            .catch((err) => console.log(err));
    }

    UploadedFiles: Array<Types.IFile>;
    SelectedFiles: Map<string, Types.IFile> = new Map<string, Types.IFile>();

    @Input() IsTitle: boolean = true;
    @Output() OnPictureSelected = new EventEmitter<Array<Types.IFile>>();
}
