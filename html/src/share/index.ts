import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {BsDropdownModule} from 'ngx-bootstrap';
import {NavbarComponent} from 'share/navbar';
import {SidebarComponent} from 'share/sidebar';
import {SwiperComp} from 'UltraCreation/ng-ion/swiper';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        BsDropdownModule.forRoot()
    ],
    declarations: [
        NavbarComponent,
        SidebarComponent,
        SwiperComp,
    ],
    exports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        TranslateModule,
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
