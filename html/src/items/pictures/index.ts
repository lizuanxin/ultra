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

    ToggleSelected(FileModel: TFileModel)
    {
        console.log('selected: ' + FileModel.Source.Id);
        FileModel.IsSelected = ! FileModel.IsSelected;
    }

    OnSelectedEnd()
    {
        let SelectedFiles: Array<Types.IFile> = [];
        this.FileModels.forEach((UploadedFile) =>
        {
            if (UploadedFile.IsSelected)
                SelectedFiles.push(UploadedFile.Source);
        });
        this.OnPictureSelected.emit(SelectedFiles);
    }

    private UpdateFileList()
    {
        this.FileSvc.List()
            .then((List) =>
            {
                console.log('updated list: ' + List.length);
                this.FileModels = List.map((UserFile) => new TFileModel(UserFile));
            })
            .catch((err) => console.log(err));
    }

    FileModels: Array<TFileModel>;

    @Input() IsTitle: boolean = true;
    @Output() OnPictureSelected = new EventEmitter<Array<Types.IFile>>();
}

export class TFileModel
{
    constructor(public Source: Types.IFile)
    {
    }

    IsSelected: boolean = false;
}
