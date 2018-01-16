import {Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter} from '@angular/core';

import {Types} from 'services';
import {TFileService} from 'services/file';
import {TBasicModalView} from '../basicmodal';

@Component({selector: 'file-lib', templateUrl: './index.html'})
export class TFileLibComponent extends TBasicModalView implements OnInit
{
    constructor(private FileService: TFileService)
    {
        super();
    }

    ngOnInit()
    {
        if (this.IsModal)
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

    UploadImage(list: FileList)
    {
        this.FileService.Upload(list)
            .then(() => this.Refresh())
            .catch(err => console.log(err));
    }

    FileClicked(f: Types.IFile)
    {
        if (! this.Selected.has(f))
        {
            if (! this.MultiSelection)
                this.Selected.clear();

            this.Selected.add(f);
        }
        else
            this.Selected.delete(f);
    }

    async RemoveFiles()
    {
        const Selected = this.Selected.values();
        for (let iter = Selected.next(); ! iter.done; iter = Selected.next())
            await this.FileService.Remove(iter.value);

        this.Refresh();
    }

    ButtonCancel()
    {
        this.Close(null);
    }

    ButtonOK()
    {
        this.Close(Array.from(this.Selected.values()));
    }

    private Refresh()
    {
        this.FileService.List()
            .then(list => this.Items = list)
            .catch((err) => console.log(err));
    }

    Items: Array<Types.IFile>;
    Selected = new Set<Types.IFile>();

    @Input() MultiSelection: boolean = true;
    @Output() OnPictureSelected = new EventEmitter<Array<Types.IFile>>();
    @ViewChild('content') contentRef: ElementRef;
}

