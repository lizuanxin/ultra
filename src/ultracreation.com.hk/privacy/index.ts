import {Component, OnInit, ViewChild } from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {Types, TAuthService} from 'services';

@Component({selector: 'privacy', templateUrl: './index.html'})
export class PrivacyPage implements OnInit
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
    oneAtATime: boolean = true;
}
