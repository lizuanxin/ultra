import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Routes, RouterModule} from '@angular/router';
import {NgxModule} from '../share/ngx.module';

import {ServiceModule, TAuthService} from 'services';
import {SharedModule} from 'share';

import {AppComponent} from './app.component';

const routes: Routes =
[
    {path: '',
        loadChildren: '../ultracreation.com.hk/#UltraCreationDomain'},

    {path: 'login',
        loadChildren: '../login/#LoginModule'},
    {path: 'signup',
        loadChildren: '../signup/#SignupModule'},

    {path: 'admin', data: {LangId: 'me', Role: ''}, canActivate: [TAuthService],
        children: [
            {path: 'account', loadChildren: '../profile/#ProfileModule', data: {LangId: 'profile', Icon: '&#xe909;', Role: ''}},
            {path: 'items', loadChildren: '../items/#ItemsModule', data: {LangId: 'items', Role: ''}},
            {path: 'doll', loadChildren: '../doll/#DollModule', data: {LangId: 'doll', Role: ''}},
            {path: 'orders', loadChildren: '../orders/#OrdersModule', data: {LangId: 'order', Role: ''}},
            {path: '', redirectTo: 'account', pathMatch: 'full'}
        ]
    },

    /// ...
    {path: '**', redirectTo: ''},
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        SharedModule,
        ServiceModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule
{
}
