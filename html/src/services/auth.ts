import {CanActivate} from '@angular/router';

import {TypeInfo} from 'UltraCreation/Core';
import {TAuthService as TBasicAuthService} from './cloud/auth'

export class TAuthService extends TBasicAuthService implements CanActivate
{
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
}