import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {THttpClient} from 'UltraCreation/Core/Http';
import { TReceiptService } from 'services/receipt';
import * as Types from 'services/cloud/types';

@Component({selector: 'order-list', templateUrl: './index.html'})
export class OrderListComponent implements OnInit
{
    constructor(private ReceiptSvc: TReceiptService)
    {
        this.ReceiptList = [];
    }

    ngOnInit()
    {
        this.Refresh();
    }

    async Refresh()
    {
        this.ReceiptList = await this.ReceiptSvc.SellList();
        console.log(this.ReceiptList);

        // console.log('receipt ' + JSON.stringify(this.ReceiptList));
    }

    ReceiptList: Array<Types.IReceipt>;
}


