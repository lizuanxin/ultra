import {NgModule, Component} from '@angular/core';
import {SharedModule, RouterModule, Routes} from 'share';

@Component({templateUrl: '../share/layout.domain.html'})
export class LayoutComponent
{
}

const routes: Routes = [
    {path: '', component: LayoutComponent}
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
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
