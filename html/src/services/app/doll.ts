import {Injectable} from '@angular/core';
import {TRestClient} from 'UltraCreation/Core';

import * as Types from '../cloud/types';
import {TAuthService} from '../authorize';

@Injectable()
export class TDollService
{
    constructor(public Auth: TAuthService)
    {
    }

    ServerList(): Promise<Array<Types.Doll.IStreamServer>>
    {
        this.Auth.Grant(this.Http);
        return this.Http.Get('/streamsrv').toPromise().then(res => res.Content);
    }

    AddServer(Content: Types.Doll.IStreamServer): Promise<Types.Doll.IStreamServer>
    {
        this.Auth.Grant(this.Http);
        return this.Http.Post('/streamsrv/append', Content).toPromise().then(res => res.Content);
    }

    RoomList(): Promise<Array<Types.Doll.IRoom>>
    {
        this.Auth.Grant(this.Http);
        return this.Http.Get('/room').toPromise().then(res => res.Content);
    }

    Append(Room: Types.Doll.IRoom): Promise<Types.Doll.IRoom>
    {
        this.Auth.Grant(this.Http);
        return this.Http.Post('/room/append', JSON.stringify(Room)).toPromise().then(res => res.Content);
    }

    Update(Room: Types.Doll.IRoom): Promise<Types.Doll.IRoom>
    {
        this.Auth.Grant(this.Http);
        return this.Http.Post('/room/update', JSON.stringify(Room)).toPromise().then(res => res.Content);
    }

    /*
    PostMessage(RoomId: Types.TIdentify, Text: string): Promise<void>
    {
        this.Auth.Grant(this.Http);
        return this.Http.Post('/room/post', JSON.stringify(Room)).toPromise().then(res => res.Content);
    }
    */
    private Http = new TRestClient('/api/app/doll');
}
