import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {TAuthService, TApplication} from 'services';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({selector: 'app-login', templateUrl: './login.component.html'})

export class LoginComponent implements OnInit, OnDestroy
{
    constructor(public router: Router, private Auth: TAuthService)
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
        });
    }

    ngOnDestroy()
    {
    }

    Submit()
    {
        this.Auth.Login(this.Sheet.value.Email, this.Sheet.value.Pass)
            .then(() =>
                this.router.navigate(['/']))
            .catch(err =>
                this.App.ShowToast('error', err));
    }

    App = window.App;
    Sheet: FormGroup;
    Email: FormControl;
    Pass: FormControl;
}
