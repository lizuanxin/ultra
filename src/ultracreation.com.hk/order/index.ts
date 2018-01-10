import {Component, OnInit, ViewChild } from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core';
import {Types, TAuthService} from 'services';

@Component({selector: 'order-info', templateUrl: './index.html'})
export class OrderInfoPage implements OnInit
{
    constructor(private Auth: TAuthService)
    {

    }
    ngOnInit()
    {

    }

    onSubmit()
    {

    }

    App = window.App;
}
