import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from 'share';
import { HomePageComponent } from './home.cmp';


const routes: Routes = [
    {path: '', component: HomePageComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ],
    declarations: [
        HomePageComponent,
    ]
})
export class HomePageModule
{
}
