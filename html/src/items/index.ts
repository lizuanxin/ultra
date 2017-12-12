import {NgModule, Component} from '@angular/core';
import {SharedModule, RouterModule, Routes} from 'share';
import {CommodityComponent} from './commodity';
import {CommodityPublishComponent } from './commodity-publish';
import {ClassifiedComponent} from './classified';

@Component({selector: 'items', templateUrl: '../share/layout.module.html'})
export class ItemsComponent
{
}

const routes: Routes = [
    {   path: '', component: ItemsComponent,
        data: { LangId: 'items', Icon: '&#xe907;', Role: '',
                group: [
                    { LangId: 'manage', Icon: '&#xe907;', Role: '', Gid: '1'},
                    { LangId: 'setting', Icon: '&#xe907;', Role: '', Gid: '2'}
                ]
        },
        children: [
            { path: 'commodity', component: CommodityComponent, data: {LangId: 'commodity', Role: '', Gid: '1'}},
            { path: 'commodity-publish/:Id', component: CommodityPublishComponent, data: {LangId: 'commodity-publish', Role: ''}},
            { path: 'classified', component: ClassifiedComponent, data: { LangId: 'classified', Show: true, Role: '', Gid: '2'}},
            { path: 'type', data: { LangId: 'type', Show: true, Role: '', Gid: '2'}},
            { path: 'specification', data: { LangId: 'specification', Show: true, Role: '', Gid: '2'}},
            { path: '', redirectTo: 'commodity'}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,

    ],
    declarations: [
        ItemsComponent,
        CommodityComponent,
        CommodityPublishComponent,
        ClassifiedComponent,

    ]
})
export class ItemsModule
{
}
