import {NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SignupComponent} from './signup.component';
import {SharedModule} from 'share';

const routes: Routes = [
    {path: '', component: SignupComponent}
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        SignupComponent
    ]
})
export class SignupModule
{
}
