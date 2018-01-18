import {Component, OnInit, TemplateRef} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {THttpClient} from 'UltraCreation/Core/Http';

import {Types, TItemService} from 'services';
import {TDollService} from 'services/app/doll';
import {NgbModal} from 'modal/modal';

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

    Refresh()
    {
        this.DollService.ServerList().then(list =>
            this.ServerList = list);
    }

    NewServer(content: HTMLTemplateElement, Srv?: Types.Doll.IStreamServer)
    {
        if (TypeInfo.Assigned(Srv))
            this.Editing = Object.assign({}, Srv);
        else
            this.Editing = this.DollService.CreateServer();

        this.Modal.open(content).result
            .then(async RetVal =>
            {
                RetVal = await this.DollService.SaveServer(this.Editing);
                this.Editing = null;

                for (let I = 0; I < this.ServerList.length; I ++)
                {
                    const Srv = this.ServerList[I];
                    if (Srv.Id === RetVal.Id)
                    {
                        this.ServerList[I] = RetVal;
                        return;
                    }
                }
                this.ServerList.push(RetVal);
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

    ServerList = new Array<Types.Doll.IStreamServer>();
    Editing: Types.Doll.IStreamServer;
}
