import {NgModule, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from 'share';
// import {HeaderComponent, FooterComponent} from './components';
// import {TAuthService} from 'services';

@Component({templateUrl: '../share/layout.domain.html'})
export class LayoutComponent
{
}

const routes: Routes = [
    {path: '', component: LayoutComponent,
        children: [
            {path: 'home',
                loadChildren: './home/index#HomePageModule'},
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
        LayoutComponent,
    ]
})
export class UltraCreationDomain
{
}
