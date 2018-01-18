import {Component, OnInit, ChangeDetectorRef, EventEmitter, Input, Output} from '@angular/core';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TFileLibComponent} from 'share/component/filelib';

import * as Types from 'services/cloud/types';
import {TItemService} from 'services/item';

import {TBasicModalView} from 'share/component/basicmodal';
import {TItemSelectorComponent} from 'items/list/selector';

@Component({selector: 'item-editor', templateUrl: './index.html'})
export class TItemEditorComponent extends TBasicModalView implements OnInit
{
    constructor()
    {
        super();

        this.ModalTitle = this.App.Translate('item.editor.title');
    }

    SetModalParams(data: any) /**@override */
    {
        this.Regions = data.Regions;
        this.Item = data.Item;
    }

    ngOnInit()
    {
        if (this.Item.PricingList.length === 0)
            this.Item.AddPricing({Region: this.Regions[0].Name});

        this.CurrPricing = this.Item.PricingList[0];
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

    ButtonCancel()
    {
        console.log('button cancel');
        this.Close(null);
    }

    ButtonOK()
    {
        this.Close(this.Item);
    }

    AddPicture()
    {
        this.App.ShowModal(TFileLibComponent, {Multiple: true, ModalMode: true}, {size: 'lg'})
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
        this.App.ShowModal(TFileLibComponent, {Multiple: false, ModalMode: true}, {size: 'lg'})
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

    ModalTitle: string;
    CurrPricing: Types.ILocalizedPricing;

    @Input() Regions: Array<Types.IRegion>;
    @Input() Item: Types.IItem;
    @Output() OnChange = new EventEmitter<Types.IItem>();
}