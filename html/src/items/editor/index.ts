import {Component, OnInit, ChangeDetectorRef, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TFileLibComponent} from 'share/component/filelib';

import * as Types from 'services/cloud/types';
import {TItemService} from 'services/item';

import {TBasicModalView} from 'share/component/basicmodal';
import {TItemSelectorComponent} from 'items/list/selector';

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

        const _FormPriceControl = new FormControl('', [Validators.pattern(/^\d+(\.\d{2})?$/)]);
        this.FormGroupPrice = new FormGroup({
            Retail: _FormPriceControl,
            BulkCount: _FormPriceControl,
            Bulk: _FormPriceControl,
            Distribute: _FormPriceControl
        });

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

    OnQuillCreated(quill)
    {
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', this.QuillImageHandler.bind(this, quill));
    }

    QuillImageHandler(quill)
    {
        App.ShowModal(TFileLibComponent, {Multiple: false, ModalMode: true}, {size: 'lg'})
            .then((Pictures) =>
            {
                const range = quill.getSelection(true);
                const index = range.index + range.length;
                quill.editor.insertEmbed(range.index, 'image', Pictures[0].Path);
            });
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
    FormGroupPrice: FormGroup;

    @Input() Regions: Array<Types.IRegion>;
    @Input() Item: Types.IItem;


}
