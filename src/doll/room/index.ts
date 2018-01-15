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
        this.DollSvc.RoomList().then(list =>
        {
            this.RoomList = list;

            if (list.length === 0)
            {
            }
        });

        this.ItemSvc.Published().then(list =>
        {
            this.DollList = list;
            console.log(list);
        });
    }

    OpenModal(content: HTMLTemplateElement, data?: Types.Doll.IRoom)
    {
        // let IsNewAdded: boolean = false;
        if (TypeInfo.Assigned(data))
            this.RoomItem = data;
        else
            this.RoomItem = new Object() as Types.Doll.IRoom;

        App.ShowModal(content, this.RoomItem, {size: 'lg'})
            .then()
            .catch((err) => console.log(err));
    }

    OpenItemList()
    {
        App.ShowModal(TItemSelectorComponent, {}, {size: 'lg'})
        .then((SelectedItems) =>
        {
            this.RoomItem.Doll = SelectedItems[0].AvatarUrl;

        });
    }

    RemovePicture(Picture)
    {
        this.RoomItem.Doll = null;
    }

    RoomList = new Array<Types.Doll.IRoom>();
    DollList = new Array<Types.IPublished>();
    RoomItem: Types.Doll.IRoom;
}
