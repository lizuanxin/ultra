import {Component, EventEmitter, Input, Output} from '@angular/core';

import {TBasicModalCompnent} from '../basicmodal';
import { TProduct } from 'services/item';
import { TFileLibComponent } from 'share/component/filelib';
import { TypeInfo } from 'UltraCreation/Core/TypeInfo';
import * as Types from 'services/cloud/types';
import { TItemService } from 'services';
import { ItemListComponent } from 'share/component/itemlist';

const MAX_PICTURES: number = 5;

@Component({selector: 'package', templateUrl: './index.html'})
export class TProductPackageComponent extends TBasicModalCompnent
{
    constructor(private ItemSvc: TItemService)
    {
        super();
    }

    OnInit()
    {

    }

    OnClosed()
    {
         this.Close(null);
    }

    OnDismiss()
    {

    }

    OpenItemList()
    {
        App.ShowModal(ItemListComponent, {IsInModalMode: true, NavOpeation: false, ItemRemove: false}, {size: 'lg'})
            .then(() =>
            {

            });

    }

    listOne: Array<object> = [{title: 'aaaaaa', num: 5}, {title: 'bbbbbbbb', num: 10}, {title: 'cccccccccccccc', num: 10}];


}



