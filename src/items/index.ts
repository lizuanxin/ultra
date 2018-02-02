import {NgModule, Component} from '@angular/core';
import {SharedModule, RouterModule, Routes} from 'share';
import {TApplication} from 'services/application';

import {TPicturesComponent} from './pictures';
import {TItemListComponent} from './list';
import {TItemEditorComponent} from './editor';
import {TItemSelectorComponent} from 'items/selector';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';

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
            {path: 'pictures', component: TPicturesComponent, data: {LangId: 'pictures', Role: ''}},

            /// ...
            {path: '', redirectTo: 'list'}
        ]
    }
];

@NgModule({
    imports: [
        SharedModule,
        // QuillEditorModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot()
    ],
    declarations: [
        LayoutComponent,
        TItemSelectorComponent,
        TItemEditorComponent,
        TItemListComponent,
        TPicturesComponent
    ],
    entryComponents: [
        TItemListComponent,
        TItemEditorComponent,
        TItemSelectorComponent,
    ],
    exports: [
        SharedModule,
        TItemListComponent,
        TItemEditorComponent,
        TItemSelectorComponent,
    ],
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
    ]
})
export class ItemsModule
{
}
