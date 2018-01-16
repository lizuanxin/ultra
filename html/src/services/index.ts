import {NgModule, InjectionToken} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {TApplication} from './application';
import {TAuthService} from './authorize';
import {TItemService} from './item';
import {TFileService} from './file';
import {TReceiptService} from 'services/receipt';

import {TShoppingCart} from './shopping_cart';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient)
{
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
    imports: [
        HttpClientModule,
        NgbModule.forRoot(),
        TranslateModule.forRoot({loader: {provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient]}}),
    ],
    exports: [
        HttpClientModule,
        TranslateModule,
        NgbModule
    ],
    providers: [
        TApplication, TAuthService, TItemService, TShoppingCart, TFileService, TReceiptService
    ],
})
export class ServiceModule
{
}

export {TApplication, TAuthService, TItemService, TShoppingCart, TFileService, TReceiptService};

import * as Types from './cloud/types';
export {Types};
