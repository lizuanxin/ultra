import { Component, OnInit, ViewChild } from '@angular/core';
import {THttpClient} from 'UltraCreation/Core';
import { TAuthService } from 'services';

@Component({templateUrl: './index.html'})
export class TensPage implements OnInit
{
    constructor(private AuthSvc: TAuthService)
    {

    }

    ngOnInit()
    {
    }

    foobar()
    {
        const form = new FormData();
        form.append('file', this.flist[0]);

        const client = new THttpClient();
        this.AuthSvc.Grant(client);
        client.Post('http://localhost:8200/file/upload', form).toPromise()
            .catch(err => console.log(err));
    }

    flist: FileList;
}
