import {Component, OnInit, ChangeDetectorRef, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TFileLibComponent} from 'share/component/filelib';

import * as Types from 'services/cloud/types';
import {TItemService} from 'services/item';

import {TItemSelectorComponent} from 'items/selector';
import { log } from 'util';
import {NgbModal, TBasicModalView} from 'share/modal';

@Component({selector: 'item-editor', templateUrl: './index.html'})
export class TItemEditorComponent extends TBasicModalView implements OnInit
{
    constructor(private Modal: NgbModal)
    {
        super();
    }

    SetModalParams(data: any) /**@override */
    {
        this.Regions = data.Regions;
        this.Item = data.Item.Clone();
        this.Items = data.items;
    }

    ngOnInit()
    {
        this.CurrPricing = this.Item.GetPricing(this.Regions[0].Name, 0);
        console.log(this.Item);

    }

    SetAvatar(url)
    {
        this.Item.AvatarUrl = url;
    }

    AddPicture()
    {
        this.Modal.Open(TFileLibComponent, {Multiple: true, ModalMode: true}, {size: 'lg'}).result
            .then(Pictures => this.Item.AddPictures(Pictures));
    }

    RemovePicture(Picture: Types.IFile)
    {
        const Idx = this.Item.Pictures.indexOf(Picture);
        this.Item.Pictures.splice(Idx, 1);
    }

    AddProduct()
    {
        this.Modal.Open(TItemSelectorComponent, {Items: this.Items, FilterType: Types.TItemTypeId.Package}, {size: 'lg'}).result
            .then((SelectedItems) =>
            {
                console.log(SelectedItems);
            });
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

    EditConfig: Object =
    {
        charCounterCount: false,
        height: 430,
        toolbarButtons: [ 'bold', 'italic', 'strikeThrough', 'underline', '|', 'paragraphFormat', 'paragraphStyle', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', '|', 'insertImage', 'insertLink', 'insertVideo', 'insertFile', 'html']
    };

    @Input() Regions: Array<Types.IRegion>;
    @Input() Item: Types.IItem;
    @Input() Items: Array<Types.IProduct>; // for package
}
