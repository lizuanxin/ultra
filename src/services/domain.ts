import {Injectable, Inject} from '@angular/core';
import { InjectionToken } from '@angular/core/src/di/injection_token';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TRestClient} from 'UltraCreation/Core/Http';
// import {DateUtils} from 'UltraCreation/Core/DateUtils';

import * as Types from './cloud/types';

export const DOMAIN_CONFIG = new InjectionToken<IDomainConfig>('domain.config');
export const DOMAIN_DI_CONFIG: IDomainConfig = {Id: ''};

@Injectable()
export class TDomainService
{
    constructor(@Inject(DOMAIN_CONFIG) private Config: IDomainConfig)
    {
    }

    List(): Promise<Array<Types.IPublished>>
    {
        return this.Http.Get('/', {Domain_Id: this.Config.Id}).toPromise().then((res) => res.Content);
    }

    Open(Published_Id: Types.TIdentify): Promise<Types.IPublished>
    {
        return this.Http.Get('/', {Id: Published_Id}).toPromise().then((res) => res.Content);
    }

    private Http = new TRestClient('/api/publish');
}

export interface IDomainConfig
{
    Id: string;
}
