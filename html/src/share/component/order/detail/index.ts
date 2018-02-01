import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {THttpClient} from 'UltraCreation/Core/Http';
import { TReceiptService } from 'services/receipt';
import * as Types from 'services/cloud/types';


@Component({selector: 'u-order-detail', templateUrl: './index.html'})
export class UOrderDetailComponent implements OnInit
{
    constructor(private ReceiptSvc: TReceiptService)
    {

    }

    ngOnInit()
    {

    }


}


