import {Component, OnInit, Input} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core';

@Component({selector: 'toast-comp', templateUrl: './index.html'})
export class TToastComponent
{
    constructor()
    {
    }

    @Input() Opts: IToastOptions;
}

export interface IToastOptions
{
    Type?: string;
    Message?: string;
    Duration?: number;
    Position?: string;
}

