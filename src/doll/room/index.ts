import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo, THttpClient} from 'UltraCreation/Core';

import {Types} from 'services';
import {TItemService, TItem, TProduct, TPackage} from 'services/item';
import {TItemSelectorComponent} from 'items/list/selector';


@Component({selector: 'doll-room', templateUrl: './index.html'})
export class DollRoomComponent implements OnInit
{
    constructor(private ItemSvc: TItemService)
    {
    }

    ngOnInit()
    {

    }

    OpenModal(content: HTMLTemplateElement)
    {
        let IsNewAdded: boolean = false;
        App.ShowModal(content, {}, {size: 'lg'})
        .then()
        .catch((err) => console.log(err));
    }

    OpenItemList()
    {
        App.ShowModal(TItemSelectorComponent, {}, {size: 'lg'})
        .then();

    }

}


