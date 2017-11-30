import {NgModule, Component} from '@angular/core';
import {SharedModule, RouterModule, Routes} from 'share';
// import { SidebarComponent } from 'theme/components/sidebar';

import {InfoComponent} from './info';
import {SecurityComponent} from './security';
import {DeliveryComponent} from './delivery';

@Component({selector: 'profile', templateUrl: '../share/layout.module.html'})
export class LayoutComponent
{
}

const routes: Routes = [
    {path: '', component: LayoutComponent, pathMatch: 'prefix',
        data: {LangId: 'profile', Icon: '&#xe909;', Role: ''},
        children: [
            {path: 'info', component: InfoComponent, data: {LangId: 'info'}},
            {path: 'security', component: SecurityComponent,  data: {LangId: 'security', Role: ''}},
            {path: 'delivery', component: DeliveryComponent, data: {LangId: 'delivery', Role: ''}},
            {path: '', redirectTo: 'info'}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        // SidebarComponent,
        LayoutComponent,
        InfoComponent,
        DeliveryComponent,
        SecurityComponent,
    ]
})
export class ProfileModule
{
}
