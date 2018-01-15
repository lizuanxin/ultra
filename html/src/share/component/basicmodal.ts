import {Input, OnInit, Injector} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TAssignable} from 'UltraCreation/Core/Persistable';

export abstract class TBasicModalCompnent implements OnInit
{
    // constructor(protected Injector: Injector)
    constructor ()
    {
    }

    abstract OnClosed(Data: any): void;
    abstract OnDismiss(Data: any): void;

    ngOnInit()
    {
        this.AssignProp();
        this.OnInit();
    }

    OnInit()
    {
    }

    AssignProp()
    {
        if (this.IsInModalMode && TypeInfo.Assigned(this.data))
            TAssignable.AssignProperties(this, JSON.parse(JSON.stringify(this.data))); // in order to depth copy
    }

    Close(Result: any)
    {
        if (this.IsInModalMode)
            App.CloseModal(Result);
        else
            this.OnClosed(Result);
    }

    Dismiss(Reason: any)
    {
        if (this.IsInModalMode)
            App.DismissModal(Reason);
        else
            this.OnDismiss(Reason);
    }

    @Input() data: any;
    @Input() IsInModalMode: boolean = false;

    App = window.App;
}
