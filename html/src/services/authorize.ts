import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

import {TypeInfo} from 'UltraCreation/Core';
import {TBasicAuthService} from './cloud/basic_auth';

@Injectable()
export class TAuthService extends TBasicAuthService implements CanActivate
{
    constructor()
    {
        super();
    }

    async canActivate(): Promise<boolean>
    {
        if (this.IsLogin)
            return true;

        if (TypeInfo.Assigned(this.UpdatingToken))
        {
            const succ = await this.UpdatingToken;

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
}
