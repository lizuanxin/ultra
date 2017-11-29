import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SharedModule} from 'share';
import {LoginComponent} from './login.component';

const routes: Routes = [
    {path: '', component: LoginComponent}
];

@NgModule({
  imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        LoginComponent
    ]
})
export class LoginModule
{
}
