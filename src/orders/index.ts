import {NgModule, Component} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SharedModule} from 'share';

import {OrderListComponent} from 'orders/list';

@Component({selector: 'orders', templateUrl: '../share/layout.module.html'})
export class LayoutComponent
{
}

const routes: Routes = [
    {path: '', component: LayoutComponent, pathMatch: 'prefix',
        data: {LangId: 'orders', Icon: '&#xe907;', Role: ''},

        children: [
            {path: 'list', component: OrderListComponent, data: {LangId: 'list', Role: ''}},
            /// ...
            {path: '', redirectTo: 'list'}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        LayoutComponent,
        OrderListComponent

    ],
    entryComponents: [
        OrderListComponent
    ],
    exports: [
    ],
})
export class OrdersModule
{
}
