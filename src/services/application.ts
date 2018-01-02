import {Injectable, Injector, TemplateRef, Inject } from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {TypeInfo} from 'UltraCreation/Core';
import {Platform} from 'UltraCreation/Core/Platform';
import {NgbModal, NgbTooltipConfig, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';


import {TShoppingCart} from './shopping_cart';
import {TItemService} from './item';
import * as Types from './cloud/types';

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
        this.ModelRefList = [];

        const ItemSvc = Injector.get(TItemService);
        ItemSvc.Regions().then((Regions) => this.Regions = Regions);
        ItemSvc.Domains().then((Domains) => this.Domains = Domains);
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
        const ModelRef = this.Modal.open(content, opts);
        ModelRef.componentInstance.data = data;
        ModelRef.componentInstance.IsInModalMode = true;
        this.ModelRefList.push(ModelRef);

        return ModelRef.result.catch((err) => this.CloseModal(null));
    }

    CloseModal(Data: any)
    {
        if (this.ModelRefList.length > 0)
        {
            const ModelRef = this.ModelRefList.pop();
            ModelRef.close(Data);
        }
    }

    DismissModal(Reason: any)
    {
        if (this.ModelRefList.length > 0)
        {
            const ModelRef = this.ModelRefList.pop();
            ModelRef.dismiss(Reason);
        }
    }

    ShowAlert(Message: string)
    {

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
    Modal: NgbModal;
    ModelRefList: Array<NgbModalRef>;
    ShoppingCart: TShoppingCart;
    Regions: Array<Types.IRegion>;
    Domains: Array<Types.IDomain>;
}
