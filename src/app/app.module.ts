import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Routes, RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {ServiceModule} from 'services';


const routes: Routes =
[
    // {path: '', loadChildren: '../index#PageModule'},
    {path: 'login', loadChildren: '../login/#LoginModule'},
    {path: 'signup', loadChildren: '../signup/#SignupModule'},
    {path: 'not-found', loadChildren: '../not-found/#NotFoundModule'},

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
export class AppModule { }
