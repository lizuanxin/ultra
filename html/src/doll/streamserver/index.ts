import {Component, OnInit, TemplateRef} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {THttpClient} from 'UltraCreation/Core/Http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap/modal/modal';

import {Types} from 'services';
import {TItemService} from 'services';
import {TDollService} from 'services/app/doll';

@Component({selector: 'doll-streamserver', templateUrl: './index.html', providers: [TDollService]})
export class TStreamServerComponent implements OnInit
{
    constructor(private DollService: TDollService, private Modal: NgbModal)
    {
    }

    ngOnInit()
    {
        this.Refresh();
    }

    NewServer(content: HTMLTemplateElement, Srv?: Types.Doll.IStreamServer)
    {
        if (TypeInfo.Assigned(Srv))
            this.Editing = Srv;
        else
            this.Editing = this.DollService.CreateServer();

        this.Modal.open(content).result
            .then(async RetVal =>
            {
                RetVal = await this.DollService.SaveServer(this.Editing);

                this.ServerList.push(RetVal);
                this.Editing = null;
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

    Refresh()
    {
        this.DollService.ServerList().then(list =>
            this.ServerList = list);
    }

    ServerList = new Array<Types.Doll.IStreamServer>();
    Editing: Types.Doll.IStreamServer;
}
