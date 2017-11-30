import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {NavbarComponent} from 'share/navbar';
import {SidebarComponent} from 'share/sidebar';
import {SwiperComp} from 'UltraCreation/ng-ion/swiper';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        TranslateModule,
    ],
    declarations: [
        SwiperComp,
        NavbarComponent,
        SidebarComponent,
    ],
    exports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        // NgbModule,
        SwiperComp,
        // ImageUploadModule,
        NavbarComponent,
        SidebarComponent,
        // ReceivingComponent
    ]
})
export class SharedModule
{
}

export {Routes, RouterModule};
