import {Component, EventEmitter, Input, Output} from '@angular/core';

import {TBasicModalCompnent} from '../basicmodal';
import { TProduct } from 'services/item';
import { TFileLibComponent } from 'share/component/filelib';
import { TypeInfo } from 'UltraCreation/Core/TypeInfo';

const MAX_PICTURES: number = 5;

@Component({selector: 'product-edit', templateUrl: './index.html'})
export class TProductEditComponent extends TBasicModalCompnent
{
    constructor()
    {
        super();
    }

    OnInit()
    {
        console.log('picture: ' + JSON.stringify(this.Product));
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

    AddMainPicture()
    {
        this.App.ShowModal(TFileLibComponent, {Multiple: false}, {size: 'lg'})
            .then((Pictures) =>
            {
            });
    }

    AddOtherPictures()
    {
        this.App.ShowModal(TFileLibComponent, {Multiple: true}, {size: 'lg'})
            .then((Pictures) =>
            {
                let AddedNum = MAX_PICTURES - this.Product.Pictures.length;
                AddedNum = AddedNum < Pictures.length ? AddedNum : Pictures.length;

                for (let i = 0; i < AddedNum; i++)
                    this.Product.PictureList.Add(Pictures[i]);
            });
    }

    ButtonCancel()
    {
        console.log('button cancel');
        this.Close(null);
    }

    ButtonOK()
    {
        console.log('button ok');
        if (this.Product.Pictures.length > 0)
            this.Product.AvatarUrl = this.Product.Pictures[0].Path;
        this.Close(this.Product);
    }

    get Name(): string
    {
        if (TypeInfo.Assigned(this.Product) && TypeInfo.Assigned(this.Product.Name))
            return this.Product.Name;
        else
            return '';
    }

    set Name(ProductName: string)
    {
        this.Product.Name = ProductName;
    }

    @Input() Product: TProduct = new TProduct();
    @Output() OnChange = new EventEmitter<TProduct>();
}



