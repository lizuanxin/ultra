import {Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {TypeInfo} from 'UltraCreation/Core';
import {Platform} from 'UltraCreation/Core/Platform';

import {Config} from './config';
export {Config};

import {NgbModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TShoppingCart} from './shopping_cart';

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

    ShowError(err: any)
    {

    }

    ShowToast(type: 'success' | 'info' | 'warning' | 'error',
        message: string, title?: string): void
    {
    }


    Platform = new Platform();
    Router: Router;
    Translation: TranslateService;
    ShoppingCart: TShoppingCart;
    Modal: NgbModal;
}
