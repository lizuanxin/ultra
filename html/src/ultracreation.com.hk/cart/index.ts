import {Component, OnInit, ViewChild} from '@angular/core';
import {TShoppingCart, TItemService} from 'services';
import { TReceiptService, TReceipt } from 'services/receipt';
import * as Types from 'services/cloud/types';


@Component({selector: 'app-shopcart-page', templateUrl: './index.html'})
export class CartPage implements OnInit
{
    constructor(private CartSvc: TShoppingCart, private ReceiptSvc: TReceiptService,
        private ItemSvc: TItemService)
    {
        this.ItemModels = [];
    }

    ngOnInit()
    {
        this.ItemSvc.PublishedList()
            .then((PublishedList) =>
            {
                console.log('published list len: ' + PublishedList.length);
                PublishedList.forEach((Published) => this.CartSvc.Add(Published));
            })
            .then(() =>
            {
                this.ItemModels =
                    this.CartSvc.List().map((ShoppingItem) => new TItemModel(ShoppingItem));
            });
    }

    get AllItemSelected(): boolean
    {
        if (this.ItemModels.length === 0)
            return false;

        return TItemModel.SelectedNum === this.ItemModels.length;
    }

    ToggleSelectAll()
    {
        let Selected = ! this.AllItemSelected;
        this.ItemModels.forEach((ItemModel) => ItemModel.IsSelected = Selected);
    }

    get SelectedItemNum(): number
    {
        return TItemModel.SelectedNum;
    }

    Delete(ItemModel: TItemModel)
    {
        ItemModel.IsSelected = false;
        this.CartSvc.Remove(ItemModel.Source.Id);
    }

    AddQty(ItemModel: TItemModel)
    {
        this.CartSvc.Update(ItemModel.Source.Id, ItemModel.Source.Qty++);
    }

    SubQty(ItemModel: TItemModel)
    {
        if (ItemModel.Source.Qty === 1)
            return;

        this.CartSvc.Update(ItemModel.Source.Id, ItemModel.Source.Qty--);
    }

    get TotalPrice()
    {
        let RetVal = 0;
        this.ItemModels.forEach((ItemModel) =>
        {
            if (ItemModel.IsSelected)
                RetVal += ItemModel.Source.Price;
        });
        return RetVal;
    }

    CommitReceipt()
    {
        let Receipt = new TReceipt();
        this.ItemModels.forEach((ItemModel) =>
        {
            if (ItemModel.IsSelected)
                Receipt.AddManifest(ItemModel.Source);
        });
        Receipt.Status = Types.TReceiptStatus.WaitForPayment;
        Receipt.ToAddress = 'awerwer';
        this.ReceiptSvc.Append(Receipt);
    }

    App = window.App;
    ItemModels: Array<TItemModel>;
}

class TItemModel
{
    static SelectedNum: number = 0;
    constructor(public Source: Types.IManifest)
    {
    }

    get IsSelected(): boolean
    {
        return this._IsSelected;
    }

    set IsSelected(Selected: boolean)
    {
        if (this._IsSelected === Selected)
            return;

        if (Selected)
            TItemModel.SelectedNum ++;
        else
            TItemModel.SelectedNum --;

        this._IsSelected = Selected;
    }

    private _IsSelected: boolean = false;
}
