import {NgModule, Component} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { TDomainService, DOMAIN_CONFIG, IDomainConfig } from 'services/domain';
import {SharedModule} from 'share';
import {ExtCalllPage} from './extcall';


const DOMAIN_DI_CONFIG: IDomainConfig = {Id: 'kktYWb9kklZYlL8k'};


const routes: Routes = [
    {path: '', component: ExtCalllPage}
];


@NgModule({
  imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ExtCalllPage
    ],
    providers: [{provide: DOMAIN_CONFIG, useValue: DOMAIN_DI_CONFIG}, TDomainService]
})
export class ExtCallModule
{
}
