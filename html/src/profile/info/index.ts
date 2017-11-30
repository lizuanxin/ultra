import {Component, OnInit, OnChanges} from '@angular/core';
import {Types, TAuthService} from 'services';

@Component({selector: 'profile-info', templateUrl: './index.html'})
export class InfoComponent implements OnInit
{
    constructor(private Auth: TAuthService)
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
    Editing = false;
}
