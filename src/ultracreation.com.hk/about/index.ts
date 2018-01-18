import {Component, OnInit, ViewChild } from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {Types, TAuthService} from 'services';

@Component({selector: 'about', templateUrl: './index.html'})
export class AboutPage implements OnInit
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
