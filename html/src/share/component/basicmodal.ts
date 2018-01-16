import {Input} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TAssignable} from 'UltraCreation/Core/Persistable';

export abstract class TBasicModalView
{
    constructor ()
    {
    }

    abstract OnClosed(Data: any): void;
    abstract OnDismiss(Data: any): void;

    SetModalParams(params: any)
    {
    }

    Close(Result: any)
    {
        if (this.ModalRef)
            this.ModalRef.close(Result);
        else
            this.OnClosed(Result);
    }

    Dismiss(Reason: any)
    {
        if (this.ModalRef)
            this.ModalRef.close(Reason);
        else
            this.OnDismiss(Reason);
    }

    get IsModal(): boolean
    {
        return TypeInfo.Assigned(this.ModalRef);
    }

    App = window.App;
    ModalRef: NgbModalRef = null;
}
