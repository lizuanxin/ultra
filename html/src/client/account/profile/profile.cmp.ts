import {Component, OnInit, OnChanges} from '@angular/core';
import {Types, TAuthService} from 'services';

@Component({selector: 'account-profile', templateUrl: './profile.cmp.html'})
export class ProfileComponent implements OnInit
{
    constructor(private Auth: TAuthService)
    {
    }

    ngDoCheck()
    {
    }

    ngOnInit()
    {

        this.Me = this.Auth.Me;
    }

    ToggleEdit()
    {

        if (this.Editing)
            this.Auth.UpdateProfile().catch(err => console.log(err));

        this.Editing = ! this.Editing;
    }

    Me: Types.IUser;
    Editing: boolean = false;
}
