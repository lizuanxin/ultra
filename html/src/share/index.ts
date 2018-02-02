import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {NgxModule} from 'share/ngx.module';
import {DndModule} from 'ng2-dnd';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';

import {NavbarComponent} from 'share/navbar';
import {SidebarComponent} from 'share/sidebar';
import {SwiperComp} from 'UltraCreation/ng-ion/swiper';
import {ReceivingComponent} from './component/receiving';

import * as Comp from './component';

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
})
export class SharedModule
{
}

export * from './component';
export * from './modal';
