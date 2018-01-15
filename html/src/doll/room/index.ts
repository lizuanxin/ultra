import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo, THttpClient} from 'UltraCreation/Core';

import {Types} from 'services';
import {TItemService} from 'services';
import {TDollService} from 'services/app/doll';

import {TItemSelectorComponent} from 'items/list/selector';

@Component({selector: 'doll-room', templateUrl: './index.html', providers: [TDollService]})
export class DollRoomComponent implements OnInit
{
    constructor(private ItemSvc: TItemService, private DollSvc: TDollService)
    {
    }

    ngOnInit()
    {
        this.DollSvc.ServerList().then(list =>
        {
            console.log(list);
            this.DollSvc.AddServer({URL: 'ultracreation.com.hk', params: ''});
        });

        this.DollSvc.RoomList().then(list =>
        {
            this.RoomList = list;

            if (list.length === 0)
            {
            }
        });

        this.ItemSvc.Published().then(list =>
            this.DollList = list);
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

    RoomList = new Array<Types.Doll.IRoom>();
    DollList = new Array<Types.IPublished>();
}
