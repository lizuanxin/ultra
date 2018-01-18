import {NgModule, Component} from '@angular/core';
import {SharedModule, RouterModule, Routes} from 'share';
import {QuillEditorModule} from 'ngx-quill-editor';

import {TApplication} from 'services/application';

import {PicturesComponent} from './pictures';
import {TItemListComponent} from './list';
import {TItemEditorComponent} from './editor';
import {TItemSelectorComponent} from 'items/list/selector';

@Component({selector: 'items', templateUrl: '../share/layout.module.html'})
export class LayoutComponent
{
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
        SharedModule,
        QuillEditorModule,
    ],
    declarations: [
        LayoutComponent,
        TItemSelectorComponent,
        TItemEditorComponent,
        TItemListComponent,
        PicturesComponent
    ],
    entryComponents: [
        TItemListComponent,
        TItemEditorComponent,
        TItemSelectorComponent,
    ],
    exports: [
        SharedModule,
        TItemEditorComponent,
        TItemListComponent,
        TItemSelectorComponent
    ],
    providers: [TApplication]
})
export class ItemShareModule
{
}

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        ItemShareModule,
    ],
    entryComponents: [
        TItemEditorComponent,
        TItemListComponent,
    ]
})
export class ItemsModule
{
}
