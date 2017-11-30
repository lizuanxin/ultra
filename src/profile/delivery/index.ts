import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TypeInfo, THttpClient } from 'UltraCreation/Core';
import { Types, TAuthService } from 'services';

@Component({ selector: 'profile-delivery', templateUrl: './index.html' })
export class DeliveryComponent implements OnInit
{
    constructor(private Auth: TAuthService)
    {
    }

    ngOnInit()
    {


    }


}

