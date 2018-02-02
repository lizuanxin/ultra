import {Component, OnInit, ViewChild } from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {Types, TAuthService} from 'services';
import { TShoppingCart } from 'services/shopping_cart';
import { TReceiptService, TReceipt } from 'services/receipt';

@Component({selector: 'order-info', templateUrl: './index.html'})
export class OrderInfoPage implements OnInit
{
    constructor(private Auth: TAuthService, private Cart: TShoppingCart, private ReceiptSvc: TReceiptService)
    {
    }

    ngOnInit()
    {
        this.Cart.Init().then(() => this.SelectedGoods = Array.from(this.Cart.Selected));
    }

    SelectUserAddress(Address: Types.IUserAddress)
    {
        console.log('selected user address: ' + JSON.stringify(Address));
        this.SelectedAddress  = Address;
    }

    async SubmitOrder()
    {
        if (! TypeInfo.Assigned(this.SelectedAddress))
        {
            console.log('err no selected address...');
            return;
        }

        const Receipt = this.ReceiptSvc.CreateReceipt();
        this.SelectedGoods.forEach((Selected) => Receipt.AddManifest(Selected));
        Receipt.ToAddress = JSON.stringify(this.SelectedAddress);
        await this.ReceiptSvc.Save(Receipt);
        this.Cart.Clear();
        console.log('the receipt submit success...');
    }

    SelectedAddress: Types.IUserAddress;
    SelectedGoods: Array<Types.IManifest>;
    App = window.App;
}
