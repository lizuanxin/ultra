import {NgModule, Component} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SharedModule} from 'share';

import {TApplication} from 'services/application';
import {ItemShareModule} from 'items';

import {TFileLibComponent} from 'share/component';
import {TDollRoomComponent} from 'doll/room';
import {TItemSelectorComponent} from 'items/selector';
import {TStreamServerComponent} from './streamserver';

@Component({selector: 'doll', templateUrl: '../share/layout.module.html'})
export class LayoutComponent
{
}

const routes: Routes = [
    {path: '', component: LayoutComponent, pathMatch: 'prefix',
        data: {LangId: 'doll', Icon: '&#xe907;', Role: ''},

        children: [
            {path: 'stream', component: TStreamServerComponent, data: {LangId: 'streamsrv', Role: ''}},
            /// ...
            {path: 'room', component: TDollRoomComponent, data: {LangId: 'room', Role: ''}},
            {path: '', redirectTo: 'room'}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        ItemShareModule,
    ],
    declarations: [
        LayoutComponent,
        TDollRoomComponent,
        TStreamServerComponent
    ],
    entryComponents: [
        TDollRoomComponent,
        TStreamServerComponent,
    ],
    providers: [TApplication]
})
export class DollModule
{
}
