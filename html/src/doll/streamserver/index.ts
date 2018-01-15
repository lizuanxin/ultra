import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo, THttpClient} from 'UltraCreation/Core';

import {Types} from 'services';
import {TItemService} from 'services';
import {TDollService} from 'services/app/doll';

import {TItemSelectorComponent} from 'items/list/selector';

@Component({selector: 'doll-streamserver', templateUrl: './index.html', providers: [TDollService]})
export class DollStreamServerComponent implements OnInit
{
    constructor(private DollSvc: TDollService)
    {
    }

    ngOnInit()
    {
        this.ListServer();
    }

    OpenModal(content: HTMLTemplateElement)
    {
        let IsNewAdded: boolean = false;

        App.ShowModal(content, {}, {size: 'lg'})
            .then()
            .catch((err) => console.log(err));


        // this.DollSvc.AddServer(StreamServer).then(() => this.ListServer());
    }

    OpenItemList()
    {
        App.ShowModal(TItemSelectorComponent, {}, {size: 'lg'})
            .then();
    }

    private ListServer()
    {
        this.DollSvc.ServerList().then(list =>
            this.ServerList = list);
    }

    ServerList = new Array<Types.Doll.IStreamServer>();
}
