import {Component, EventEmitter, Input, Output} from '@angular/core';

import { TProduct, TItem, TPackage, TItemService } from 'services/item';
import { TFileLibComponent } from 'share/component/filelib';
import { TypeInfo } from 'UltraCreation/Core/TypeInfo';
import * as Types from 'services/cloud/types';
import { TBasicModalCompnent } from 'share/component/basicmodal';
import { TItemSelectorComponent } from 'items/list/selector';

const MAX_PICTURES: number = 5;

@Component({selector: 'item-edit', templateUrl: './index.html'})
export class TItemEditComponent extends TBasicModalCompnent
{
    constructor(private ItemSvc: TItemService)
    {
        super();
    }

    // override
    OnInit()
    {
        console.log('picture: ' + JSON.stringify(this.Item.Pictures.length));
    }

    // override
    AssignProp()
    {
        // console.log(JSON.stringify(this.data));
        if (TypeInfo.Assigned(this.data) && TypeInfo.Assigned(this.data.Item))
            this.Item = TItem.CreateNew(this.data.Item.TypeId);

        super.AssignProp();
    }

    OnClosed(Data: any)
    {
        console.log('closed...');
        this.OnChange.emit(Data);
    }

    OnDismiss(Data: any)
    {
        console.log('dismissed...');
        this.OnChange.emit(Data);
    }

    AddOtherPictures()
    {
        this.App.ShowModal(TFileLibComponent, {Multiple: true, ModalMode: true}, {size: 'lg'})
            .then((Pictures) =>
            {
                if (! TypeInfo.Assigned(Pictures))
                    return;
                let AddingNum = Pictures.length > this.RemainingNum ? this.RemainingNum : Pictures.length;

                for (let i = 0; i < AddingNum; i++)
                    this.Item.PictureList.Add(Pictures[i]);
            });
    }

    RemovePicture(Picture: Types.IFile)
    {
        this.Item.PictureList.Remove(Picture);
    }

    get RemainingNum()
    {
        return MAX_PICTURES - this.Item.Pictures.length;
    }

    ButtonCancel()
    {
        console.log('button cancel');
        this.Close(null);
    }

    ButtonOK()
    {
        console.log('button ok');
        if (this.Item.Pictures.length > 0)
            this.Item.AvatarUrl = this.Item.Pictures[0].Path;
        this.Close(this.Item);
    }

    get Name(): string
    {
        if (TypeInfo.Assigned(this.Item) && TypeInfo.Assigned(this.Item.Name))
            return this.Item.Name;
        else
            return '';
    }

    set Name(ItemName: string)
    {
        this.Item.Name = ItemName;
    }

    get IsPackage(): boolean
    {
        return this.Item.TypeId === Types.TItemTypeId.Package;
    }

    OpenItemList()
    {
        App.ShowModal(TItemSelectorComponent, {FilterItems: this.FilterItems}, {size: 'lg'})
            .then((SelectedItems) =>
            {
                if (! TypeInfo.Assigned(SelectedItems))
                    return;

                for (let SelectedItem of SelectedItems)
                    (this.Item as TPackage).Add(SelectedItem, 1);
            });
    }

    get FilterItems()
    {
        let RetFilterItems = [];
        if (TypeInfo.Assigned(this.Item.Id) && this.Item.Id.length > 0)
            RetFilterItems.push(this.Item.Id);

        RetFilterItems.concat((this.Item as TPackage).ProductInfoList.map((ProductInfo) => ProductInfo.Product));
        console.log(RetFilterItems);

        return RetFilterItems;
    }

    GetAvatarUrl(ProductId: string): string
    {
        return this.ItemSvc.GetItem(ProductId).AvatarUrl;
    }

    GetItemName(ProductId: string): string
    {
        return this.ItemSvc.GetItem(ProductId).Name;
    }

    SubQty(ProductInfo: any)
    {
        if (ProductInfo.Qty === 1)
            return;
        ProductInfo.Qty --;
    }

    AddQty(ProductInfo: any)
    {
        ProductInfo.Qty ++;
    }

    @Input() Item: TItem;
    @Output() OnChange = new EventEmitter<TProduct>();
}


