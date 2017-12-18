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
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ReceivingComponent} from './component/receiving';
import {FileUploadComponent} from './component/fileupload';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        NgbModule,
        NgZorroAntdModule,
        ScrollToModule.forRoot()
    ],
    declarations: [
        NavbarComponent,
        SidebarComponent,
        SwiperComp,
        ReceivingComponent,
        FileUploadComponent
    ],
    exports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        NgbModule,
        SwiperComp,
        ScrollToModule,
        NavbarComponent,
        SidebarComponent,
        ReceivingComponent,
        FileUploadComponent
    ]
})
export class SharedModule
{
}

export {Routes, RouterModule};