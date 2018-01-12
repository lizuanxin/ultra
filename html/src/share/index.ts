import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from 'share/navbar';
import {SidebarComponent} from 'share/sidebar';
import {SwiperComp} from 'UltraCreation/ng-ion/swiper';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import {ReceivingComponent} from './component/receiving';
import {DndModule} from 'ng2-dnd';
import * as Comp from './component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        NgbModule,
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
        NgbModule,
        DndModule,
        SwiperComp,
        ScrollToModule,
        NavbarComponent,
        SidebarComponent,
        ReceivingComponent,
        Comp.TFileLibComponent,
        Comp.TAlertComponent,
        Comp.TToastComponent
    ]
})
export class SharedModule
{
}

export {Routes, RouterModule};
