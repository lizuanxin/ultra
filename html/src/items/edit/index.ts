import {Component, EventEmitter, Input, Output} from '@angular/core';

import {TProduct, TItem, TPackage, TItemService} from 'services/item';
import {TFileLibComponent} from 'share/component/filelib';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';

import * as Types from 'services/cloud/types';
import {TBasicModalCompnent} from 'share/component/basicmodal';
import {TItemSelectorComponent} from 'items/list/selector';

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
        if (TypeInfo.Assigned(App.Regions.length) && App.Regions.length > 0)
            this.SelectedRegion = App.Regions[0];

        for (let Region of App.Regions)
            this.PricingListMap.set(Region.Name, {Region: Region.Name, Retail: 0, BulkCount: 0, Bulk: 0});
        for (let Pricing of this.Item.PricingList)
            this.PricingListMap.set(Pricing.Region, Pricing);
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
        this.Item.PricingList = [];
        this.PricingListMap.forEach((Pricing) =>
        {
            if (Pricing.Retail > 0)
                this.Item.PricingList.push(Pricing);
        });
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
        App.ShowModal(TItemSelectorComponent,
            {FilterItems: this.FilterProducts, FilterType: Types.TItemTypeId.Package}, {size: 'lg'})
            .then((SelectedItems) =>
            {
                if (! TypeInfo.Assigned(SelectedItems))
                    return;

                for (let SelectedItem of SelectedItems)
                    (this.Item as TPackage).Add(SelectedItem, 1);
            });
    }

    get FilterProducts()
    {
        return (this.Item as TPackage).ProductInfoList.map((ProductInfo) => ProductInfo.Product);
    }

    GetAvatarUrl(ProductId: string): string
    {
        return this.ItemSvc.GetItem(ProductId).AvatarUrl;
    }

    GetItemName(ProductId: string): string
    {
        return this.ItemSvc.GetItem(ProductId).Name;
    }

    DeleteProduct(ProductId: string)
    {
        (this.Item as TPackage).Remove(ProductId);
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

    get Html(): string
    {
        if (TypeInfo.Assigned(this.Item) && TypeInfo.Assigned(this.Item.Html))
            return this.Item.Html;
        else
            return '';
    }

    set Html(ItemDetail: string)
    {
        this.Item.Html = ItemDetail;
    }

    onContentChanged({ html, text })
    {
        console.log('html:' + html, 'text:' + text);
    }

    onEditorCreated(quill)
    {
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', this.imageHandler.bind(this, quill));
    }

    imageHandler(quill)
    {
        this.App.ShowModal(TFileLibComponent, {Multiple: false, ModalMode: true}, {size: 'lg'})
            .then((Pictures) =>
            {
                const range = quill.getSelection(true);
                const index = range.index + range.length;
                quill.editor.insertEmbed(range.index, 'image', Pictures[0].Path);
            });
    }

    get CurrPricing()
    {
        return this.PricingListMap.get(this.SelectedRegion.Name);
    }

    @Input() Item: TItem;
    @Output() OnChange = new EventEmitter<TProduct>();

    private SelectedRegion: Types.IRegion;
    private PricingListMap = new Map<string, Types.ILocalizedPricing>();
}


