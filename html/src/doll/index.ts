import {NgModule, Component} from '@angular/core';
import {SharedModule, RouterModule, Routes} from 'share';

import { TApplication } from 'services/application';
import { TFileLibComponent } from 'share/component';
import { DollRoomComponent } from 'doll/room';
import { TItemSelectorComponent } from 'items/list/selector';
import { ItemsModule, ItemShareModule } from 'items';

@Component({selector: 'doll', templateUrl: '../share/layout.module.html'})
export class LayoutComponent
{
    constructor(App: TApplication)
    {
    }
}

const routes: Routes = [
    {path: '', component: LayoutComponent, pathMatch: 'prefix',
        data: {LangId: 'doll', Icon: '&#xe907;', Role: ''},

        children: [
            {path: 'room', component: DollRoomComponent, data: {LangId: 'room', Role: ''}},

            /// ...
            {path: '', redirectTo: 'list'}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ItemShareModule,
        SharedModule,
    ],
    declarations: [
        LayoutComponent,
        DollRoomComponent,
    ],
    entryComponents: [
        TFileLibComponent,
        TItemSelectorComponent,
        DollRoomComponent
    ],
    providers: [TApplication]
})
export class DollModule
{
}
