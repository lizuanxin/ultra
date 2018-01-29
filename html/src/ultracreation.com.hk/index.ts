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
import { HealthPage } from './health';
import { CableMagicPage } from './health/cablemagic';
import { AboutPage } from './about';
import { ContactPage } from './contact';
import { TeamsPage } from './teams';
import { PrivacyPage } from './privacy';
import { ProDetailPage } from './pro-detail';
import { TDomainService, DOMAIN_CONFIG, IDomainConfig } from 'services/domain';
import { UOrderListComponent } from 'share/component/orderlist';


const DOMAIN_DI_CONFIG: IDomainConfig = {Id: 'kktYWb9kklZYlL8k'};


@Component({templateUrl: '../share/layout.domain.html'})
export class LayoutComponent
{
}

const routes: Routes = [
    {path: '', component: LayoutComponent,
        children: [
            {path: 'home', component: HomePage},
            {path: 'health', component: HealthPage},
            {path: 'health/cable', component: CableMagicPage},
            {path: 'detail/:id', component: DetailPage},
            {path: 'pro-detail/:id', data: {}, component: ProDetailPage},
            {path: 'cart', component: CartPage},
            {path: 'myorder', component: UOrderListComponent},
            {path: 'tens', component: TensPage},
            {path: 'order', component: OrderInfoPage},
            {path: 'about', component: AboutPage},
            {path: 'contact', component: ContactPage},
            {path: 'teams', component: TeamsPage},
            {path: 'privacy', component: PrivacyPage},
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
        ProDetailPage,
        RelateComponent,
        CartPage,
        UOrderListComponent,
        AboutPage,
        ContactPage,
        TeamsPage,
        PrivacyPage,
        OrderInfoPage,
        SiteNavbarComponent,
        FooterComponent
    ],
    providers: [{provide: DOMAIN_CONFIG, useValue: DOMAIN_DI_CONFIG}, TDomainService]
})
export class UltraCreationDomain
{
}
