import {Component, Input, OnInit} from '@angular/core';
import { TypeInfo } from 'UltraCreation/Core';

@Component({selector: 'alert-comp', templateUrl: './index.html'})
export class TAlertComponent implements OnInit
{
    constructor()
    {
        this.Opts = {};
    }

    ngOnInit()
    {
        if (! TypeInfo.Assigned(this.Opts.Inputs))
            this.Opts.Inputs = [];
    }

    BtnClicked(Button: IAlertButton)
    {
        if (TypeInfo.Assigned(Button.Handler))
        {
            const RetVal: {[k: string]: any} = {};
            this.Opts.Inputs.forEach((InputOpt) => RetVal[InputOpt.Name] = InputOpt.Value);
            Button.Handler(RetVal);
        }

        // this.App.CloseModal(null);
    }

    App = window.App;

    @Input() Opts: IAlertOptions;
}

export interface IAlertOptions
{
    Title?: string;
    Message?: string;
    Inputs?: Array<IAlertInputOptions>;
    Buttons?: Array<IAlertButton | string>;
    BackdropDismiss?: boolean;
}

export interface IAlertInputOptions
{
    Type?: string;
    Name?: string;
    Value?: any;
    Placeholder?: string;
}

export interface IAlertButton
{
    Text?: string;
    Class?: string;
    Handler?: (Value: any) => boolean | void;
}
