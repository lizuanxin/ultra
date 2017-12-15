import {Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {TypeInfo, THttpClient} from 'UltraCreation/Core';
import {TFileService} from 'services/file';
import {Types} from 'services';

@Component({selector: 'file-upload', templateUrl: './index.html'})

export class FileUploadComponent implements OnInit
{

    UpdateImageDisplay(file: FileList)
    {
        let imgView = document.querySelector('.' + this.ViewId) as HTMLElement;

        if (TypeInfo.Assigned(file.length))
        {
            this.MaxNum = false;

            if (TypeInfo.Assigned(this.Num) &&  (imgView.children.length + 1 > this.Num || file.length > this.Num))
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
            // Object.assign(this.ArrayImg, file);
            // console.log(this.ArrayImg);
            console.log('fuck');

            this.ArrayImg.emit(file);

        }
    }

    ngOnInit()
    {
        // this.ArrayImg.subscribe((file) =>
        // {
        //     console.log('serwer');
        // });
    }

    @Input() ViewId: string;
    @Input() Num: number;
    @Input() DataList: Array<string>;
    @Output() ArrayImg = new EventEmitter<any>();

    private FileSvc: TFileService;
    UploadedFiles: Array<Types.IFile>;
    MaxWarning: boolean = false;
    MaxNum: boolean = false;
}
