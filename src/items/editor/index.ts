import {Component, OnInit, ChangeDetectorRef, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TFileLibComponent} from 'share/component/filelib';

import * as Types from 'services/cloud/types';
import {TItemService} from 'services/item';

import {TBasicModalView} from 'share/component/basicmodal';
import {TItemSelectorComponent} from 'items/list/selector';
import { log } from 'util';

@Component({selector: 'item-editor', templateUrl: './index.html'})
export class TItemEditorComponent extends TBasicModalView implements OnInit
{
    SetModalParams(data: any) /**@override */
    {
        this.Regions = data.Regions;
        this.Item = data.Item.Clone();
    }

    ngOnInit()
    {
        this.CurrPricing = this.Item.GetPricing(this.Regions[0].Name, 0);
    }

    SetAvatar(url)
    {
        this.Item.AvatarUrl = url;
    }

    AddPicture()
    {
        App.ShowModal(TFileLibComponent, {Multiple: true, ModalMode: true}, {size: 'lg'})
            .then(Pictures => this.Item.AddPictures(Pictures));
    }

    RemovePicture(Picture: Types.IFile)
    {
        const Idx = this.Item.Pictures.indexOf(Picture);
        this.Item.Pictures.splice(Idx, 1);
    }


    AddProduct()
    {
        /*
        App.ShowModal(TItemSelectorComponent,
            {FilterItems: this.FilterProducts, FilterType: Types.TItemTypeId.Package}, {size: 'lg'})
            .then((SelectedItems) =>
            {
                if (! TypeInfo.Assigned(SelectedItems))
                    return;

                for (let SelectedItem of SelectedItems)
                    (this.Item as TPackage).Add(SelectedItem, 1);
            });
        */
    }

    OnChange(e)
    {
       return e.target.value = parseFloat(parseFloat(e.target.value).toFixed(2));
    }

    RemoveProduct(ProductInfo: Types.IProductInfo)
    {
        const Package = this.Item as Types.IPackage;

        const Idx = Package.ProductInfoList.indexOf(ProductInfo);
        Package.ProductInfoList.splice(Idx, 1);
        // (this.Item as TPackage).Remove(ProductId);
    }

    SubQty(ProductInfo: Types.IProductInfo)
    {
        if (ProductInfo.Qty > 1)
            ProductInfo.Qty --;
    }

    AddQty(ProductInfo: Types.IProductInfo)
    {
        ProductInfo.Qty ++;
    }


    CurrPricing: Types.ILocalizedPricing;
    EditConfig: Object = { charCounterCount: false, heightMin: 100, heightMax: 500 };

    @Input() Regions: Array<Types.IRegion>;
    @Input() Item: Types.IItem;


}


