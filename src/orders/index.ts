import { NgModule, Component } from '@angular/core';
import { SharedModule, RouterModule, Routes } from 'share';
import { TApplication } from 'services/application';
import { OrderListComponent } from 'orders/list';


@Component({selector: 'orders', templateUrl: '../share/layout.module.html'})
export class LayoutComponent
{
    constructor(App: TApplication)
    {
    }
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
    providers: [TApplication]
})


export class OrdersModule
{
}
