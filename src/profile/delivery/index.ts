import {Component, OnInit} from '@angular/core';
import {Types, TAuthService} from 'services';

@Component({templateUrl: './index.html'})
export class DeliveryComponent implements OnInit
{
    constructor(private Auth: TAuthService)
    {
    }

    ngOnInit()
    {
    }
}

