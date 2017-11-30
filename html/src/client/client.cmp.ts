import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {THttpClient} from 'UltraCreation/Core';

@Component({selector: 'account', templateUrl: '../share/layout.html'})
export class ClientComponent implements OnInit
{
    constructor(private Route: ActivatedRoute)
    {

    }

    ngOnInit()
    {
    }
}
