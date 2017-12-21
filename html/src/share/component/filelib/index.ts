import {Component, Input, Output, EventEmitter} from '@angular/core';

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
        this.UpdateFileList();
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
            .then(() => this.UpdateFileList())
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

    @Input() Multiple: boolean = true;
    @Output() OnPictureSelected = new EventEmitter<Array<Types.IFile>>();
}

export class TFileModel
{
    constructor(public Source: Types.IFile)
    {
    }

    IsSelected: boolean = false;
}
