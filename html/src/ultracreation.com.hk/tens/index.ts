import { Component, OnInit, ViewChild } from '@angular/core';
import {THttpClient} from 'UltraCreation/Core';

@Component({templateUrl: './index.html'})
export class TensPage implements OnInit
{
    constructor()
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
        client.Post('http://localhost:8200/upload', form).toPromise()
            .catch(err => console.log(err));
    }

    flist: FileList;
}
