import {Component, OnInit, ViewChild} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import {TItemService} from 'services';
import * as Types from 'services/cloud/types';
import { TShoppingCart } from 'services/shopping_cart';


@Component({selector: 'app-shopcart-page', templateUrl: './index.html'})
export class CartPage implements OnInit
{
    constructor(private CartSvc: TShoppingCart, private router: Router)
    {
        this.Manifests = [];
    }

    ngOnInit()
    {
        setTimeout(() => this.Refresh());
    }

    Refresh()
    {
        this.Manifests = this.CartSvc.List();
        console.log('Cart items: ' + JSON.stringify(this.Manifests));
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

    Settlement()
    {
        if (this.CartSvc.Selected.size === 0)
            console.error('No item selected');
        else
            this.router.navigate(['order']);
    }

    App = window.App;
    Manifests: Array<Types.IManifest>;
}
