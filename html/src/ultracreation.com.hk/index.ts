import {NgModule, Component} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from 'share';

// import {HeaderComponent, FooterComponent} from './components';
// import {TAuthService} from 'services';
import {HomePage} from './home';
import {TensPage} from './tens';
import {ListPage} from './list';
import {DetailPage} from './detail';
import {FooterComponent} from './share/footer';


@Component({templateUrl: '../share/layout.domain.html'})
export class LayoutComponent
{
}

const routes: Routes = [
    {path: '', component: LayoutComponent,
        children: [
            {path: 'home', component: HomePage},
            {path: 'list', component: ListPage},
            {path: 'detail/:id', component: DetailPage},
            {path: 'tens', component: TensPage},
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
        ListPage,
        DetailPage,
        FooterComponent
    ]
})
export class UltraCreationDomain
{
}