import {Injectable, Injector, TemplateRef, ReflectiveInjector} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {Platform} from 'UltraCreation/Core/Platform';
import {NgbModal, NgbModalOptions, NgbModalRef} from '../modal/modal.module';

import {TShoppingCart} from './shopping_cart';

import {TAlertComponent, IAlertOptions} from 'share/component/alert';
import {TToastComponent, IToastOptions} from 'share/component';

declare global
{
    /* extends Application to window global variable */
    var App: TApplication | undefined;

    interface Window
    {
        App: TApplication | undefined;
    }
}

@Injectable()
export class TApplication
{
    constructor(Injector: Injector)
    {
        console.log('TApplication construct');
        window.App = this;

        this.Router = Injector.get(Router);
        this.Translation = Injector.get(TranslateService);
        this.InitializeLanguage();

        this.Modal = Injector.get(NgbModal);
    }

/* langulage support */

    InitializeLanguage()
    {
        this.Translation.addLangs(['en', 'zh-chs', 'zh-cht']);
        this.Translation.setDefaultLang('en');

        const browserLang = App.Translation.getBrowserLang().toLowerCase();
        console.log('Browser Language: ' + browserLang);

        if (browserLang.match(/zh-chs|zh|zh-CN/))
            this.Translation.use('zh-chs');
        else if (browserLang.match(/zh-cht|zh-tw|zh-hk|zh-sg/))
            this.Translation.use('zh-cht');
    }

    SetDefaultLanguage(lang: string)
    {
        this.Translation.setDefaultLang(lang);
    }

    get Languages(): string[]
    {
        return this.Translation.getLangs();
    }

    AddLanguage(Name: string, Translation?: Object, Merge: boolean = false)
    {
        if (TypeInfo.Assigned(Translation))
            this.Translation.setTranslation(Name, Translation, Merge);
        else
            this.Translation.addLangs([Name]);

        if (this.Languages.length === 1)
            this.Translation.setDefaultLang(Name);
    }

    get Language(): string
    {
        const RetVal = this.Translation.currentLang;

        if (TypeInfo.Assigned(RetVal))
            return RetVal;
        else
            return 'en';
    }

    set Language(Value: string)
    {
        this.Translation.use(Value);
    }

    Translate(Key: string | string[]): any
    {
        return this.Translation.instant(Key);
    }

    async ShowModal(content: any, data?: any, opts?: NgbModalOptions)
    {
        const ModalRef = this.Modal.open(content, opts);

        if (TypeInfo.Assigned(ModalRef.componentInstance))
        {
            ModalRef.componentInstance.ModalRef = ModalRef;
            ModalRef.componentInstance.SetModalParams(data);
        }
        return ModalRef.result.catch((err) => ModalRef.close(null));
    }

    ShowAlert(Opts: IAlertOptions | string)
    {
        if (TypeInfo.IsPrimitive(Opts))
            Opts = {Message: Opts};

        if (! TypeInfo.Assigned(Opts.Buttons))
            Opts.Buttons = [{Text: 'OK'}];

        const ModalRef = this.Modal.open(TAlertComponent, {backdrop: false, windowClass: 'modal-alert'});
        ModalRef.componentInstance.Opts = Opts;

        return ModalRef.result.catch((err) => ModalRef.close(null));
    }

    ShowError(err: any)
    {
        this.ShowToast('error', err.message);
    }

    ShowToast(type: 'success' | 'info' | 'warning' | 'error',
        message: string, duration: number = 1500): void
    {
        const ToastOpts: IToastOptions =
        {
            Type: type,
            Message: message
        };
        const ModalRef = this.Modal.open(TToastComponent, {backdrop: false, windowClass: 'toast-default'});
        ModalRef.componentInstance.Opts = ToastOpts;
        setTimeout(() => ModalRef.dismiss(), duration);
    }

    Platform = new Platform();
    Router: Router;
    Translation: TranslateService;
    Modal: NgbModal;
    ShoppingCart: TShoppingCart;
}
