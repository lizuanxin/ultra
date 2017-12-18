import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TypeInfo, THttpClient} from 'UltraCreation/Core';
import {TFileService} from 'services/file';
import {Types} from 'services';

@Component({selector: 'file-upload', templateUrl: './index.html'})

export class FileUploadComponent
{

    UpdateImageDisplay(file: FileList)
    {
        let imgView = document.querySelector('.' + this.viewId) as HTMLElement;

        if (TypeInfo.Assigned(file.length))
        {
            this.MaxNum = false;

            if (TypeInfo.Assigned(this.num) &&  (imgView.children.length + 1 > this.num || file.length > this.num))
            {
                return this.MaxNum = true;
            }

            for (let i = 0; i < file.length; i++)
            {
                if (file[i].size > 1048576 / 2)
                {
                    return this.MaxWarning = true;
                }
                else
                {
                    this.MaxWarning = false;
                    let image = document.createElement('img');
                    image.src = window.URL.createObjectURL(file[i]);
                    imgView.appendChild(image);
                }
            }
            let _obj = {id: this.viewId, filed: file};
            this.ArrayImage.emit(_obj);
        }
    }


    @Input() viewId: string;
    @Input() num: number;
    @Input() DataList: Array<string>;
    @Output() ArrayImage = new EventEmitter<any>();

    private FileSvc: TFileService;
    UploadedFiles: Array<Types.IFile>;
    MaxWarning: boolean = false;
    MaxNum: boolean = false;
}
