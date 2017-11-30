import {NgModule, InjectionToken} from '@angular/core';

import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TApplication} from './application';

import {TAuthService} from './auth';
import {TItemService} from 'services/item';

import {TShoppingCart} from './shopping_cart';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient)
{
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
    imports: [
        HttpClientModule,
        TranslateModule.forRoot({loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]}}),
    ],
    exports: [
        HttpClientModule,
        TranslateModule,
    ],
    providers: [
        TApplication, TAuthService, TItemService, TShoppingCart
    ],
})
export class ServiceModule
{
}

export {TApplication, TAuthService, TShoppingCart};
export {TItemService} from './item';

import * as Types from './types';
export {Types};
