import {NgModule, Component} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from 'share';

// import {HeaderComponent, FooterComponent} from './components';
// import {TAuthService} from 'services';
import {HomePage} from './home';
import {TensPage} from './tens';
import {DetailPage} from './detail';
import {FooterComponent} from './share/footer';
import {RelateComponent} from './components/relate';
import {SiteNavbarComponent} from './share/navbar';
import {CartPage} from './cart';
import {OrderInfoPage} from './order';
import { CableMagicPage } from './pro/cablemagic';
import { HealthPage } from './pro/health';
import { AboutPage } from './about';
import { ContactPage } from './contact';


@Component({templateUrl: '../share/layout.domain.html'})
export class LayoutComponent
{
}

const routes: Routes = [
    {path: '', component: LayoutComponent,
        children: [
            {path: 'home', component: HomePage},
            {path: 'cable', component: CableMagicPage},
            {path: 'health', component: HealthPage},
            {path: 'detail/:id', component: DetailPage},
            {path: 'cart', component: CartPage},
            {path: 'tens', component: TensPage},
            {path: 'order', component: OrderInfoPage},
            {path: 'about', component: AboutPage},
            {path: 'contact', component: ContactPage},
            /// ...
            {path: '', redirectTo: 'home'}
        ]
}
];

@NgModule({
    imports: [
        SharedModule,
        TranslateModule,
        RouterModule.forChild(routes),
    ],
    exports: [
    ],
    declarations: [
        LayoutComponent,
        HomePage,
        TensPage,
        CableMagicPage,
        HealthPage,
        DetailPage,
        RelateComponent,
        CartPage,
        AboutPage,
        ContactPage,
        OrderInfoPage,
        SiteNavbarComponent,
        FooterComponent
    ]
})
export class UltraCreationDomain
{
}
