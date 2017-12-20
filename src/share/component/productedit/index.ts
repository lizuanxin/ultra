import {Component, EventEmitter, Input, Output} from '@angular/core';

import {TBasicModalCompnent} from '../basicmodal';
import { TProduct } from 'services/item';
import { TFileLibComponent } from 'share/component/filelib';

@Component({selector: 'product-edit', templateUrl: './index.html'})
export class TProductEditComponent extends TBasicModalCompnent
{
    constructor()
    {
        super();
        this.Name = '';
    }

    OnInit()
    {
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
        this.App.ShowModal(TFileLibComponent, {Multiple: false}, {size: 'lg'})
            .then((Pictures) =>
            {
            });
    }

    ButtonClose()
    {
    }

    ButtonOK()
    {
        this.Close(this.Product);
    }

    Name: string;

    @Input() Product: TProduct = null;
    @Output() OnChange = new EventEmitter<TProduct>();
}



