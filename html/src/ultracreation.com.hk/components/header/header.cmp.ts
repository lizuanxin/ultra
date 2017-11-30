import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TAuthService} from 'services';

@Component({selector: 'page-header', templateUrl: './header.cmp.html'})
export class HeaderComponent implements OnInit
{
    constructor(public Auth: TAuthService, private translate: TranslateService)
    {

    }

    ngOnInit()
    {

    }

    Logout()
    {
        this.Auth.Logout();
    }
}
