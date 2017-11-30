import { Component, OnInit, ViewChild } from '@angular/core';
import {Types, TAuthService, TApplication} from 'services';

@Component({selector: 'account-security', templateUrl: './security.cmp.html'})
export class SecurityComponent implements OnInit
{
    constructor(private Auth: TAuthService, private app: TApplication)
    {

    }

    ngOnInit()
    {
    }

    ChangePassword()
    {
        this.Auth.PasswordRecovery(this.Auth.Me.Email)
            .then(res => this.app.ShowToast('success', 'success'));
    }
}
