import {NgModule, InjectionToken} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TApplication} from './application';
import {TAuthService} from './authorize';
import {TItemService} from './item';
import {TFileService} from './file';
import {TReceiptService} from 'services/receipt';

import {TShoppingCart} from './shopping_cart';

import { NgxModule } from 'share/ngx.module';
import { DOMAIN_CONFIG, DOMAIN_DI_CONFIG, TDomainService } from 'services/domain';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient)
{
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
    imports: [
        HttpClientModule,
        NgxModule.forRoot(),
        TranslateModule.forRoot({loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]}}),
    ],
    exports: [
        HttpClientModule,
        TranslateModule,
        NgxModule
    ],
    providers: [
        TApplication, TAuthService, TItemService, TShoppingCart, TFileService, TReceiptService,
        {provide: DOMAIN_CONFIG, useValue: DOMAIN_DI_CONFIG}, TDomainService
    ],
})
export class ServiceModule
{
}

export {TApplication, TAuthService, TItemService, TShoppingCart, TFileService, TReceiptService};

import * as Types from './cloud/types';
export {Types};
