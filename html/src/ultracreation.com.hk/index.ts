import {NgModule, Component} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from 'share';

// import {HeaderComponent, FooterComponent} from './components';
// import {TAuthService} from 'services';
import {HomePage} from 'ultracreation.com.hk/home';

@Component({templateUrl: '../share/layout.domain.html'})
export class LayoutComponent
{
}

const routes: Routes = [
    {path: '', component: LayoutComponent,
        children: [
            {path: 'home',
                component: HomePage},

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
    ]
})
export class UltraCreationDomain
{
}