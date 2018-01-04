import {Component, Input, OnInit} from '@angular/core';
import * as Types from 'services/cloud/types';


@Component({selector: 'domain-comp', templateUrl: './index.html'})
export class DomainComponent implements OnInit
{
    constructor()
    {

    }

    ngOnInit()
    {

    }

    BtnClicked()
    {

        this.App.CloseModal(null);
    }

    App = window.App;

    @Input() Opts: Types.IPublishing;
}


