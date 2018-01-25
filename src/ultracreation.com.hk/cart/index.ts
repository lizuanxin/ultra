import {Component, OnInit, ViewChild} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import {TShoppingCart, TItemService} from 'services';
import { TReceiptService, TReceipt } from 'services/receipt';
import * as Types from 'services/cloud/types';


@Component({selector: 'app-shopcart-page', templateUrl: './index.html'})
export class CartPage implements OnInit
{
    constructor(private CartSvc: TShoppingCart, private ReceiptSvc: TReceiptService,
        private ItemSvc: TItemService, private router: Router)
    {
        this.Manifests = [];
    }

    ngOnInit()
    {
        this.ItemSvc.Published()
            .then((PublishedList) =>
            {
                console.log('published list len: ' + PublishedList.length);
                PublishedList.forEach((Published) => this.CartSvc.Add(Published));
            })
            .then(() =>
            {
                this.Refresh();
            });
    }

    Refresh()
    {
        this.Manifests = this.CartSvc.List();
    }

    get AllItemSelected(): boolean
    {
        return this.Manifests.length === this.CartSvc.Selected.size && this.Manifests.length > 0;
    }

    ToggleSelectAll()
    {
        if (this.CartSvc.Selected.size < this.Manifests.length)
            this.Manifests.forEach((Manifest) => this.CartSvc.Selected.add(Manifest));
        else
            this.CartSvc.Selected.clear();
    }

    SelectionChanged(Selected: boolean, Manifest: Types.IManifest)
    {
        if (Selected)
            this.CartSvc.Selected.add(Manifest);
        else
            this.CartSvc.Selected.delete(Manifest);
    }

    IsSelected(Manifest: Types.IManifest)
    {
        return this.CartSvc.Selected.has(Manifest);
    }

    get SelectedNum(): number
    {
        return this.CartSvc.Selected.size;
    }

    Delete(Manifest: Types.IManifest)
    {
        this.CartSvc.Remove(Manifest);
        this.Refresh();
    }

    AddQty(Manifest: Types.IManifest)
    {
        Manifest.Qty ++;
        this.CartSvc.Update(Manifest);
    }

    SubQty(Manifest: Types.IManifest)
    {
        if (Manifest.Qty === 1)
            return;

        Manifest.Qty--;
        this.CartSvc.Update(Manifest);
    }

    get TotalPrice()
    {
        let RetVal = 0;
        this.CartSvc.Selected.forEach((Manifest) => RetVal += Manifest.Price);
        return RetVal;
    }

    CommitReceipt()
    {
        // this.router.navigate(['order'], { queryParams: { page: 1 } });
        let Receipt = new TReceipt();
        this.CartSvc.Selected.forEach((Manifest) => Receipt.AddManifest(Manifest));
        Receipt.Status = Types.TReceiptStatus.WaitForPayment;
        Receipt.ToAddress = 'awerwer';
        this.ReceiptSvc.Save(Receipt);
    }

    App = window.App;
    Manifests: Array<Types.IManifest>;
}
