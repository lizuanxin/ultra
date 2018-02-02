import {NgModule, ModuleWithProviders} from '@angular/core';

import {NgbModalBackdrop} from './modal-backdrop';
import {NgbModalWindow} from './modal-window';
import {NgbModalStack} from './modal-stack';
import {NgbModal} from './service';

@NgModule({
    declarations: [NgbModalBackdrop, NgbModalWindow],
    entryComponents: [NgbModalBackdrop, NgbModalWindow],
    providers: [NgbModal]
})
export class NgbModalModule
{
    static forRoot(): ModuleWithProviders
    {
        return {ngModule: NgbModalModule, providers: [NgbModal, NgbModalStack]};
    }
}
