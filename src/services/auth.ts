import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Subject} from 'rxjs/Subject';

import {TypeInfo} from 'UltraCreation/Core/TypeInfo';
import {THttpClient, TRestClient} from 'UltraCreation/Core/Http';
import {Config} from './config';
import * as Types from './types';

const Anonymous: Types.IUserResponse =
    { Id: '---', Email: '',  EmailValidated: false, FirstName: 'anonymous', Token: ''};

export type TAuthState = 'login' | 'logout' | 'token_expired';

@Injectable()
export class TAuthService implements CanActivate
{
    static get Me(): Types.IUserResponse
    {
        return this._Me;
    }

    static set Me(v: Types.IUserResponse)
    {
        if (! TypeInfo.Assigned(v.FirstName))
            v.FirstName = v.Email.substring(0, v.Email.lastIndexOf('@'));
        this._Me = v;
    }

    private static _Me = Anonymous;

/* Instances */

    constructor()
    {
        console.log('TAuthService construct');
        this.UpdateToken();

        this.OnStateChange.subscribe(state =>
        {
            let last_path = localStorage.getItem('last_path');
            if (TypeInfo.Assigned(last_path))
            {
                App.Router.navigate([last_path]);
                localStorage.removeItem('last_path');
            }

            if ((App.Router.url.indexOf('admin') !== -1) && !this.IsLogin)
                App.Router.navigate(['/']);
        });
    }

    get Me(): Types.IUserResponse
    {
        return (this.constructor as typeof TAuthService).Me;
    }

    get DefaultAddress(): Types.IUserAddress
    {
        let values = this.AddressHash.values();

        let iter = values.next();
        let first = iter.value;

        if (this.AddressHash.size === 1)
            return first;

        for (; ! iter.done; iter = values.next())
        {
            if (iter.value.IsDefault)
                return iter.value;
        }

        return first;
    }

    Grant(Client: THttpClient)
    {
        Client.Authorization('Basic', this.Me.Token);
    }

    get IsLogin()
    {
        return (this.constructor as typeof TAuthService).Me.Id !== Anonymous.Id;
    }

    async SignIn(Email: string, Password: string, Name?: string): Promise<void>
    {
        let res = await this.Auth.Post('register', {Email: Email, Password: Password, FirstName: Name}).toPromise();
        let user = res.Content as Types.IUserResponse;
        localStorage.setItem('auth:user', JSON.stringify(user));

        (this.constructor as typeof TAuthService).Me = user;
        this.OnStateChange.next('login');
    }

    async Login(Email: string, Password: string): Promise<void>
    {
        let res = await this.Auth.Post('login', {Email: Email, Password: Password}).toPromise();
        let user = res.Content as Types.IUserResponse;
        localStorage.setItem('auth:user', JSON.stringify(user));

        (this.constructor as typeof TAuthService).Me = user;
        this.OnStateChange.next('login');
    }

    async PasswordRecovery(Email: string): Promise<void>
    {
        await this.Auth.Get('recovery', {Email: Email}).toPromise();
    }

    async Logout(): Promise<void>
    {
        (this.constructor as typeof TAuthService).Me = Anonymous;

        localStorage.removeItem('auth:user');
        this.OnStateChange.next('logout');
    }

    async UpdateProfile(): Promise<void>
    {
        await this.Auth.Post('update', this.Me).toPromise();
        localStorage.setItem('auth:user', JSON.stringify(this.Me));
    }

    async Addresses(): Promise<Array<Types.IUserAddress>>
    {
        if (! TypeInfo.Assigned(this.AddressHash))
        {
            this.AddressHash = new Map<string, any>();

            this.Grant(this.Addr);
            await this.Addr.Get('/').toPromise().then(res =>
            {
                for (let iter of  res.Content as Array<Types.IUserAddress>)
                    this.AddressHash.set(iter.Id, iter);
            });
        }

        return Array.from(this.AddressHash.values());
    }

    async AppendAddress(Addr: Types.IUserAddress): Promise<Array<Types.IUserAddress>>
    {
        this.Grant(this.Addr);
        let res = await this.Addr.Post('append', Addr).toPromise();

        Addr.Id = res.Content.Id;
        this.AddressHash.set(Addr.Id, Addr);

        return Array.from(this.AddressHash.values());
    }

    async UpdateAddress(Addr: Types.IUserAddress): Promise<Array<Types.IUserAddress>>
    {
        this.Grant(this.Addr);
        await this.Addr.Post('update', Addr).toPromise();
        this.AddressHash.set(Addr.Id, Addr);

        return Array.from(this.AddressHash.values());
    }

    async RemoveAddress(Addr: Types.IUserAddress): Promise<Array<Types.IUserAddress>>
    {
        this.Grant(this.Addr);
        await this.Addr.Post('remove', {Id: Addr.Id}).toPromise();
        this.AddressHash.delete(Addr.Id);

        return Array.from(this.AddressHash.values());
    }

    async SetDefaultAddress(Addr: Types.IUserAddress): Promise<Array<Types.IUserAddress>>
    {
        if (! Addr.IsDefault)
        {
            this.Grant(this.Addr);
            await this.Addr.Post('def', {Id: Addr.Id}).toPromise();
            this.AddressHash.forEach(iter => iter.IsDefault = false);
            Addr.IsDefault = true;
        }

        return Array.from(this.AddressHash.values());
    }

    private UpdateToken(): void
    {
        let user: Types.IUserResponse;
        try
        {
            user = JSON.parse(localStorage.getItem('auth:user'));
            if (! TypeInfo.Assigned(user) || ! TypeInfo.Assigned(user.Token))
                return;
        }
        catch (e)
        {
            return;
        }

        this.UpdatingToken = this.Auth.Get('/', {Token: user.Token}).toPromise()
            .then(res => res.Content as Types.ITokenResponse)
            .then(ret =>
            {
                if (ret.Token.length > 0)
                {
                    user.Token = ret.Token;
                    localStorage.setItem('auth:user', JSON.stringify(user));
                    delete user.Token;

                    user.Token = ret.Token;
                    (this.constructor as typeof TAuthService).Me = user;

                    this.OnStateChange.next('login');
                    return true;
                }
                else
                {
                    this.OnStateChange.next('token_expired');
                    return false;
                }
            })
            .catch(err =>
            {
                localStorage.removeItem('auth:user');
                this.OnStateChange.next('token_expired');

                return false;
            })
            .then(RetVal =>
            {
                this.UpdatingToken = undefined;
                return RetVal;
            });
    }

    /* CanActivate */

    async canActivate(): Promise<boolean>
    {
        if (this.IsLogin)
            return true;

        if (TypeInfo.Assigned(this.UpdatingToken))
        {
            let succ = await this.UpdatingToken;

            if (! succ)
            {
                localStorage.setItem('last_path', App.Router.url);
                App.Router.navigate(['/login']);
            }
            return succ;
        }
        else
        {

            localStorage.setItem('last_path', App.Router.url);
            App.Router.navigate(['/login']);
            return false;
        }
    }

    OnStateChange = new Subject<TAuthState>();

    private Auth = new TRestClient(Config.API_ENDPOINT + '/auth');
    private Addr = new TRestClient(Config.API_ENDPOINT + '/addr');
    private UpdatingToken: Promise<boolean> | undefined;
    private AddressHash: Map<string, Types.IUserAddress> | undefined;
}
