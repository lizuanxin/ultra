import {NgModule, Component} from '@angular/core';
import {SharedModule, RouterModule, Routes} from 'share';
import {PicturesComponent} from './pictures';
import { TApplication } from 'services/application';
import { TFileLibComponent } from 'share/component';
import { TItemEditComponent } from 'items/edit';
import { TItemListComponent } from 'items/list';

@Component({selector: 'items', templateUrl: '../share/layout.module.html'})
export class LayoutComponent
{
    constructor(App: TApplication)
    {
    }
}

const routes: Routes = [
    {path: '', component: LayoutComponent, pathMatch: 'prefix',
        data: {LangId: 'items', Icon: '&#xe907;', Role: ''},

        children: [
            {path: 'list', component: TItemListComponent, data: {LangId: 'list', Role: ''}},
            {path: 'pictures', component: PicturesComponent, data: {LangId: 'pictures', Role: ''}},

            /// ...
            {path: '', redirectTo: 'list'}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ],
    declarations: [
        LayoutComponent,
        TItemEditComponent,
        TItemListComponent,
        PicturesComponent
    ],
    entryComponents: [
        TFileLibComponent,
        TItemEditComponent,
        TItemListComponent
    ],
    providers: [TApplication]
})
export class ItemsModule
{
}
