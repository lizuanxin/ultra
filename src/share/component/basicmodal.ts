import {Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TAssignable} from 'UltraCreation/Core/Persistable';

export abstract class TBasicModalCompnent implements OnInit
{
    abstract OnInit(): void;
    abstract OnClosed(Data: any): void;
    abstract OnDismiss(Data: any): void;

    ngOnInit()
    {
        this.AssignProp();
        this.OnInit();
    }

    AssignProp()
    {
        if (this.IsInModalMode && TypeInfo.Assigned(this.data))
            TAssignable.AssignProperties(this, this.data);
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
