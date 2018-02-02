import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {THttpClient} from 'UltraCreation/Core/Http';
import { TReceiptService } from 'services/receipt';
import * as Types from 'services/cloud/types';
import { TReceiptStatus } from 'services/cloud/types';


@Component({selector: 'u-order-list', templateUrl: './index.html'})
export class UOrderListComponent implements OnInit
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
        this.ReceiptList = await this.ReceiptSvc.BuyList();
        this.ReceiptList.forEach(item =>
        {
            console.log(item);
        });
        // console.log('receipt ' + JSON.stringify(this.ReceiptList));
    }

    Status(Val: TReceiptStatus)
    {
        switch (Val)
        {
            case TReceiptStatus.WaitForPayment:
                return 'Wait for payment';
            case TReceiptStatus.Paid:
                return 'Paid, Waiting for delivering';
            case TReceiptStatus.Delivering:
                return 'Delivering';
            case TReceiptStatus.Done:
                return 'Done';
            case TReceiptStatus.Cancel:
                return 'Cancelled';

            default:
                return 'Unkown';
        }
    }

    ReceiptList: Array<Types.IReceipt>;
}


