import { Component, OnInit } from '@angular/core';
import { TAuthService } from 'services';
import { TypeInfo } from 'UltraCreation/Core/TypeInfo';
import { NavigationEnd } from '@angular/router';
import { log } from 'util';

@Component({selector: 'nav-bar', templateUrl: './navbar.cmp.html'})
export class NavBarComponent implements OnInit
{
    constructor(public Auth: TAuthService)
    {
    }

    ngOnInit()
    {
        if (!this.IsAdmin) return;
        this.App.Router.config.forEach(route =>
        {
            if (! TypeInfo.Assigned(route.canActivate))
                return;
            route.children.forEach(item =>
            {
                if (item.path !== '')
                {
                    const Item = {  Link: '/' + route.path + '/' + item.path, LangId: item.data.LangId + '.title'};
                    this.MenuItems.push(Item);
                }
            });

        });
    }

    toggleSidebar()
    {
        const dom: any = document.querySelector('body');
        const nav_primary: any = document.querySelector('div.nav-primary');
        if (TypeInfo.Assigned(nav_primary))
            nav_primary.classList.toggle('nav-fixed-top');
        else
            dom.classList.toggle('push-right');
    }

    rltAndLtr()
    {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    Logout()
    {
        this.Auth.Logout();
    }



    ChangeLang(lang: string)
    {
        App.Language = lang;
    }

    App = window.App;
    IsAdmin: boolean = App.Router.routerState.snapshot.url.split('/')[1] === 'admin';
    MenuItems = new Array<object>();
}
