import {Component, OnInit, Input} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';

@Component({selector: 'toast-comp', templateUrl: './index.html'})
export class TToastComponent
{
    constructor()
    {
    }

    SetModalParams(opts: IToastOptions)
    {
        this.Opts = opts;
    }

    @Input() Opts: IToastOptions;
}

export interface IToastOptions
{
    Type?: string;
    Message?: string;
    Position?: string;
}
