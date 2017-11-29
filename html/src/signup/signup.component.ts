import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {PasswordValidators} from 'ngx-validators';

import {TAuthService, TApplication} from 'services';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit
{
    constructor(public router: Router, private Auth: TAuthService, private app: TApplication)
    {
    }

    ngOnInit()
    {
        this.Sheet = new FormGroup({
            Email: this.Email = new FormControl('', [
                Validators.required,
                Validators.email
            ]),

            Pass: this.Pass = new FormControl('', [
                Validators.required,
                Validators.minLength(6)
            ]),

            RenterPass: this.RenterPass = new FormControl('', [
                Validators.required,
            ])
        }, PasswordValidators.mismatchedPasswords('Pass', 'RenterPass'));
    }

    Submit()
    {
        this.Auth.SignIn(this.Sheet.value.Email, this.Sheet.value.Pass)
            .then(() =>
            {
                this.router.navigate(['/']);

            })
            .catch(err => this.app.ShowToast('error', err));
    }

    Sheet: FormGroup;
    Email: FormControl;
    Pass: FormControl;
    RenterPass: FormControl;
}
