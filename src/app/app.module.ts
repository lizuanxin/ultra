import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Routes, RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {ServiceModule, TAuthService} from 'services';

const routes: Routes =
[
    {path: '',
        loadChildren: '../ultracreation.com.hk/#UltraCreationDomain'},

    {path: 'admin',
        // canActivate: [TAuthService], data: {LangId: 'me', Role: ''},
        children: [
            {path: 'account', loadChildren: '../profile/#ProfileModule', data: {LangId: 'account', Icon: '&#xe909;', Role: ''}},
            {path: 'items', loadChildren: '../items/#ItemsModule', data: {LangId: 'items', Role: ''}},
            {path: '', redirectTo: 'account', pathMatch: 'full'}
        ]
    },

    {path: 'login',
        loadChildren: '../login/#LoginModule'},
    {path: 'signup',
        loadChildren: '../signup/#SignupModule'},
    {path: 'not-found',
        loadChildren: '../not-found/#NotFoundModule'},
    /// ...
    {path: '**', redirectTo: 'not-found'},
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        ServiceModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule
{
}
