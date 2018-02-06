import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as Types from 'services/cloud/types';

@Component({templateUrl: './index.html'})
export class HomePage implements OnInit
{
    constructor()
    {

    }

    ngOnInit()
    {

    }


    SwitchIndex(n: number)
    {
        this.ActiveIndex = n;
    }

    get PicPath(): string
    {
        switch (this.ActiveIndex)
        {
            case 0: return 'assets/images/site/2018020622666.jpg';
            case 1: return 'assets/images/site/2018020622888.jpg';
        }

    }


    ActiveIndex: number = 0;

}
