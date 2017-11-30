import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {UltraCreationComponent} from './index.cmp';
import {SharedModule} from 'share';
import {HeaderComponent, FooterComponent} from './components';
import {TAuthService} from 'services';


const routes: Routes = [
    {path: '', component: UltraCreationComponent,
        children: [
            {path: 'home', loadChildren: './home/index#HomePageModule'},
            // {path: 'about', loadChildren: './about/index#AboutPageModule'},
            // {path: 'cart', loadChildren: '../theme/components/shopcart/index#CartPageModule'},
            // {path: 'order', loadChildren: './orderlist/index#OrderPageModule', canActivate: [TAuthService]},
            // {path: 'product', loadChildren: './product/index#ProductPageModule'},
            {path: '', redirectTo: 'home'}
        ]
}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule,
        SharedModule
    ],
    exports: [
    ],
    declarations: [
        UltraCreationComponent,
        HeaderComponent,
        FooterComponent
    ]
})
export class UltraCreationDomain
{
}
