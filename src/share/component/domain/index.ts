import {Component, Input, OnInit} from '@angular/core';

import * as Types from 'services/cloud/types';
import {TItemService} from 'services/item';


@Component({selector: 'domain-comp', templateUrl: './index.html'})
export class DomainComponent implements OnInit
{
    constructor(private ItemSvc: TItemService)
    {
    }

    ngOnInit()
    {
        this.ItemSvc.Domains().then(list => this.Domains = list);
    }

    BtnClicked()
    {
        let SelectedDomains: Array<Types.IDomain> = [];

        this.Domains.forEach(domain =>
        {
            /*
            if (domain.IsSelected)
                SelectedDomains.push(DomainModel.Source);
            */
        });
        // this.App.CloseModal(SelectedDomains);
    }

    App = window.App;

    Domains: Array<Types.IDomain>;
    Selected = new Set<Types.IDomain>();
}

export class TDomainModel
{
    static SelectedNum: number = 0;

    constructor(public Source: Types.IDomain)
    {
    }

    get IsSelected()
    {
        return this._IsSelected;
    }

    set IsSelected(Selected: boolean)
    {
        if (this._IsSelected === Selected)
            return;

        this._IsSelected = Selected;
        if (this._IsSelected)
            TDomainModel.SelectedNum ++;
        else
            TDomainModel.SelectedNum --;
    }

    _IsSelected: boolean = false;
}


