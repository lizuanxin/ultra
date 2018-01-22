import {Injectable} from '@angular/core';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {TRestClient} from 'UltraCreation/Core/Http';
// import {DateUtils} from 'UltraCreation/Core/DateUtils';

import * as Types from './cloud/types';

@Injectable()
export class TDomainService
{
    constructor(private Id: string)
    {
    }

    List(): Promise<Array<Types.IPublished>>
    {
        return this.Http.Get('/', {Domain_Id: this.Id}).toPromise().then((res) => res.Content);
    }

    Open(Published_Id: Types.TIdentify): Promise<Types.IPublished>
    {
        return this.Http.Get('/', {Id: Published_Id}).toPromise().then((res) => res.Content);
    }

    private Http = new TRestClient('/api/publish');
}
