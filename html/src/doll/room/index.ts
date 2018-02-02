import {Component, OnInit, TemplateRef } from '@angular/core';
import {NgbModal} from 'share/modal';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {Types} from 'services';
import {TItemService} from 'services';
import {TDollService} from 'services/app/doll';

import {TItemSelectorComponent} from 'items/selector';

@Component({selector: 'doll-room', templateUrl: './index.html', providers: [TDollService]})
export class TDollRoomComponent implements OnInit
{
    constructor(private ItemService: TItemService, private DollService: TDollService,
        private Modal: NgbModal)
    {
    }

    ngOnInit()
    {
        this.ItemService.Published().then(list =>
        {
            this.DollList = list;
            console.log(list);
        });

        this.Refresh();
    }

    Refresh()
    {
        this.DollService.RoomList().then(list =>
        {
            this.RoomList = list;
            console.log(list);
        });
    }

    OpenModal(content: HTMLTemplateElement, Room?: Types.Doll.IRoom)
    {
        if (TypeInfo.Assigned(Room))
            this.Editing = Object.assign({}, Room);
        else
            this.Editing = this.DollService.RoomCreate();


        this.Modal.Open(content, {size: 'lg'}).result
            .then(async RetVal =>
            {
                RetVal = await this.DollService.RoomStore(this.Editing);
                this.Editing = null;

                for (let I = 0; I < this.RoomList.length; I ++)
                {
                    const Room = this.RoomList[I];
                    if (Room.Id === RetVal.Id)
                    {
                        this.RoomList[I] = RetVal;
                        return;
                    }
                }
                this.RoomList.push(RetVal);
            })
            .catch(err =>
            {
                this.Editing = null;

                if (err instanceof Error)
                    App.ShowError(err);
                else
                    console.log(err);
            });
    }

    OpenItemList()
    {
        /*
        App.ShowModal(TItemSelectorComponent, {}, {size: 'lg'})
        .then((SelectedItems) =>
        {
            this.RoomItem.Doll = SelectedItems[0].AvatarUrl;

        });
        */
    }

    DollList = new Array<Types.IPublished>();
    RoomList = new Array<Types.Doll.IRoom>();

    Editing: Types.Doll.IRoom;
}
