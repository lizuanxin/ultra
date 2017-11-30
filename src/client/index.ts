import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'share';
import { ClientComponent } from './client.cmp';
import { ReceivingComponent } from './components/receiving';
import { ProfileComponent } from './account/profile';
import { SecurityComponent } from './account/security';
import { DeliveryComponent } from './account/delivery';

// import { MyorderComponent } from './order/myorder';
// import { QuillEditorModule } from 'ngx-quill-editor';


const routes: Routes = [
    {   path: '', component: ClientComponent, pathMatch: 'prefix',
        data: {
            LangId: 'ucenter', Icon: '&#xe909;', Role: '',
            group: [
                { LangId: 'account', Icon: '&#xe909;', Role: '', Gid: '1' },
                { LangId: 'order', Icon: '&#xe909;', Role: '', Gid: '2' }
            ]
        },
        children: [
            { path: 'profile', component: ProfileComponent, data: {LangId: 'profile', Role: '', Gid: '1'}},
            { path: 'security', component: SecurityComponent,  data: {LangId: 'security', Role: '', Gid: '1'}},
            { path: 'delivery', component: DeliveryComponent, data: {LangId: 'delivery', Role: '', Gid: '1'}},
            // { path: 'myorder', component: MyorderComponent, data: {LangId: 'myorder', Role: '', Gid: '2'}},
            { path: '', redirectTo: 'profile'}
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        // QuillEditorModule,
        SharedModule
    ],
    declarations: [
        ClientComponent,
        ReceivingComponent,
        ProfileComponent,
        DeliveryComponent,
        SecurityComponent,
        // MyorderComponent

    ]
})
export class ClientModule
{

}
