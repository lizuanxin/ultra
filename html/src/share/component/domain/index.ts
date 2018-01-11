import {Component, Input, OnInit} from '@angular/core';
import * as Types from 'services/cloud/types';


@Component({selector: 'domain-comp', templateUrl: './index.html'})
export class DomainComponent implements OnInit
{
    constructor()
    {
        this.DomainModels = [];
    }

    ngOnInit()
    {
        this.DomainModels = App.Domains.map((Domain) => new TDomainModel(Domain));
    }

    BtnClicked()
    {
        let SelectedDomains: Array<Types.IDomain> = [];
        this.DomainModels.forEach((DomainModel) =>
        {
            if (DomainModel.IsSelected)
                SelectedDomains.push(DomainModel.Source);
        });
        this.App.CloseModal(SelectedDomains);
    }

    App = window.App;

    DomainModels: Array<any>;
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


