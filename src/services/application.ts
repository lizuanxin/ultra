import {Injectable, Injector, TemplateRef, ReflectiveInjector} from '@angular/core';

import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {Platform} from 'UltraCreation/Core/Platform';
import {NgbModal, NgbModalOptions, NgbModalRef} from 'share/modal';

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
    IsMinScreen = false;

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

    /*
    async ShowModal(content: any, data?: any, opts?: NgbModalOptions): Promise<any>
    {
        const ModalRef = this.Modal.open(content, opts);

        if (TypeInfo.Assigned(ModalRef.componentInstance))
        {
            ModalRef.componentInstance.ModalRef = ModalRef;
            ModalRef.componentInstance.SetModalParams(data);
        }
        return ModalRef.result;
    }
    */

    ShowAlert(Opts: IAlertOptions | string): Promise<any>
    {
        if (TypeInfo.IsPrimitive(Opts))
            Opts = {Message: Opts};

        if (! TypeInfo.Assigned(Opts.Buttons))
            Opts.Buttons = [{Text: 'OK'}];

        const ModalRef = this.Modal.Open(TAlertComponent, Opts, {backdrop: false, windowClass: 'modal-alert'});

        return ModalRef.result.catch((err) => ModalRef.close(null));
    }

    ShowError(err: any)
    {
        if (err instanceof Error)
        {
            const msg: any = err.message;

            if (TypeInfo.IsObject(msg))
            {
                // from http request
                if (TypeInfo.Assigned(msg.err))
                    this.ShowToast('error', msg.err);
                else
                    this.ShowToast('error', JSON.stringify(msg.err));
            }
        }
        else if (TypeInfo.IsString(err))
            this.ShowToast('error', err);
    }

    ShowToast(type: 'success' | 'info' | 'warning' | 'error',
        message: string, duration: number = 1500): void
    {
        if (['error', 'warning'].indexOf(type) !== -1)
            duration *= 10;

        const ToastOpts: IToastOptions =
        {
            Type: type,
            Message: message
        };

        const ModalRef = this.Modal.Open(TToastComponent, ToastOpts, {backdrop: true, windowClass: 'toast-default'});
        setTimeout(() => ModalRef.dismiss(), duration);
    }

    Platform = new Platform();
    Router: Router;
    Translation: TranslateService;
    ShoppingCart: TShoppingCart;

    // impossable to globally use
    private Modal: NgbModal;
}
