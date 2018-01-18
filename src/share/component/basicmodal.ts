import {Input} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TAssignable} from 'UltraCreation/Core/Persistable';

export abstract class TBasicModalView
{
    constructor ()
    {
    }

    SetModalParams(params: any)
    {
    }

    Close(Result: any)
    {
        if (this.ModalRef)
            this.ModalRef.close(Result);
        else
            console.log('close called.');
    }

    Dismiss(Reason: any)
    {
        if (this.ModalRef)
            this.ModalRef.dismiss(Reason);
        else
            console.log('dismiss called.');
    }

    get IsModal(): boolean
    {
        return TypeInfo.Assigned(this.ModalRef);
    }

    ModalRef: any = null;
}
