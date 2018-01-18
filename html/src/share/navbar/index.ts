import {Component, OnInit, Inject, HostListener} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';

import {TAuthService} from 'services';
import { log } from 'util';

@Component({selector: 'navbar', templateUrl: './index.html'})

export class NavbarComponent implements OnInit
{

    constructor(public Auth: TAuthService, @Inject(DOCUMENT) private document: Document)
    {

    }

    ngOnInit()
    {
        const _body: any = document.querySelector('body');
        _body.style.height = 'auto';

        if (!this.IsAdmin) return;
        this.App.Router.config.forEach(route =>
        {
            // if (! TypeInfo.Assigned(route.canActivate))
            //     return;

            if (route.path === 'admin')
            {
                route.children.forEach(item =>
                {
                    if (item.path !== '')
                    {
                        const Item = {  Link: '/' + route.path + '/' + item.path, LangId: item.data.LangId + '.title'};
                        this.MenuItems.push(Item);
                    }
                });
            }

        });

    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
      const number =  this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
        console.log(number);

      if (number > 50) {
            this.navIsFixed = true;
      } else {
            this.navIsFixed = false;
      }

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
    MenuItems = new Array<object>();
    IsAdmin: boolean = App.Router.routerState.snapshot.url.split('/')[1] === 'admin';
    isCollapsed: boolean = true;
    navIsFixed: boolean = false;
}
