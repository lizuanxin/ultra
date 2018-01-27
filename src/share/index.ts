import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';
import {NgxModule} from 'share/ngx.module';
import {DndModule} from 'ng2-dnd';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';

import {NavbarComponent} from 'share/navbar';
import {SidebarComponent} from 'share/sidebar';
import {SwiperComp} from 'UltraCreation/ng-ion/swiper';
import {ReceivingComponent} from './component/receiving';
import * as Comp from './component';
import {TApplication} from 'services';
import {ScrollViewDirective} from 'directive/scrollview';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        NgxModule,
        DndModule.forRoot(),
        ScrollToModule.forRoot()
    ],
    declarations: [
        ScrollViewDirective,
        NavbarComponent,
        SidebarComponent,
        SwiperComp,
        ReceivingComponent,
        Comp.TFileLibComponent,
        Comp.TAlertComponent,
        Comp.TToastComponent,
        Comp.DomainComponent
    ],
    entryComponents: [
        Comp.TFileLibComponent,
        Comp.TAlertComponent,
        Comp.TToastComponent,
        Comp.DomainComponent
    ],
    exports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        NgxModule,
        DndModule,
        ScrollToModule,

        SwiperComp,
        NavbarComponent,
        SidebarComponent,
        ReceivingComponent,
        Comp.TFileLibComponent,
        Comp.TAlertComponent,
        Comp.TToastComponent,
    ],
    providers: [TApplication]
})
export class SharedModule
{
}

export {Routes, RouterModule};
