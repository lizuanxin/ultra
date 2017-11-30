import {Component, OnInit, ViewChild} from '@angular/core';
import {Types, TAuthService, TApplication} from 'services';

@Component({selector: 'profile-security', templateUrl: './index.html'})
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
