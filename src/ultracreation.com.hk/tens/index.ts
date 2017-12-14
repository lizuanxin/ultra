import { Component, OnInit, ViewChild } from '@angular/core';
import {THttpClient} from 'UltraCreation/Core';
import { TFileService } from 'services/file';

import * as Types from 'services/cloud/types';

@Component({templateUrl: './index.html'})
export class TensPage implements OnInit
{
    constructor(private FileSvc: TFileService)
    {
        this.UploadedFiles = [];
    }

    ngOnInit()
    {
        setTimeout(() => this.UpdateFileList(), 500);
    }

    foobar()
    {
        this.FileSvc.Upload(this.flist)
            .then(() => this.UpdateFileList())
            .catch(err => console.log(err));
    }

    remove(File: Types.IFile)
    {
        this.FileSvc.Remove(File)
            .then(() => this.UpdateFileList())
            .catch((err) => console.log(err));
    }

    OnInputFileChanged(files: any)
    {
        console.log(files);
        this.flist = files;
    }

    private UpdateFileList()
    {
        this.FileSvc.List()
            .then((List) => this.UploadedFiles = List)
            .catch((err) => console.log(err));
    }

    flist: FileList;
    UploadedFiles: Array<Types.IFile>;
}
