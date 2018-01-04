import {Component, Input, Output, ElementRef, ViewChild, EventEmitter} from '@angular/core';

import {TBasicModalCompnent} from '../basicmodal';

import {Types} from 'services';
import {TFileService} from 'services/file';

@Component({selector: 'file-lib', templateUrl: './index.html'})
export class TFileLibComponent extends TBasicModalCompnent
{
    constructor(private FileSvc: TFileService)
    {
        super();
    }

    OnInit()
    {
        if (this.IsInModalMode)
            this.contentRef.nativeElement.style = 'height:420px; overflow-x:hidden; overflow-y:auto';
        this.Refresh();
    }

    OnClosed(Data: any)
    {
        this.OnPictureSelected.emit(Data);
    }

    OnDismiss(data: any)
    {
    }

    UploadImage(file: any)
    {
        this.FileSvc.Upload(file)
            .then(() => this.Refresh())
            .catch(err => console.log(err));
    }

    FileClicked(FileModel: TFileModel)
    {
        console.log('selected: ' + FileModel.Source.Id);
        if (! this.Multiple)
        {
            for (let Model of this.FileModels)
            {
                if (Model.IsSelected && FileModel.Source.Id !== Model.Source.Id)
                {
                    Model.IsSelected = false;
                    break;
                }
            }
        }
        FileModel.IsSelected = ! FileModel.IsSelected;
    }

    async RemoveFiles()
    {
        for (let FileModel of this.FileModels)
        {
            if (FileModel.IsSelected)
            {
                await this.FileSvc.Remove(FileModel.Source);
            }
        }

        this.Refresh();
    }

    ButtonCancel()
    {
        this.Close(null);
    }

    ButtonOK()
    {
        let SelectedFiles: Array<Types.IFile> = [];
        this.FileModels.forEach((UploadedFile) =>
        {
            if (UploadedFile.IsSelected)
                SelectedFiles.push(UploadedFile.Source);
        });

        this.Close(SelectedFiles);
    }

    private Refresh()
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

    @Input() Multiple: boolean = true;
    @Output() OnPictureSelected = new EventEmitter<Array<Types.IFile>>();
    @ViewChild('content') contentRef: ElementRef;
}

export class TFileModel
{
    constructor(public Source: Types.IFile)
    {
    }

    IsSelected: boolean = false;
}
