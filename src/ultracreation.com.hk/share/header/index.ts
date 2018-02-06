import {Component, OnInit, DoCheck, Inject, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/platform-browser';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';

import {TAuthService} from 'services';
import { log } from 'util';


@Component({selector: 'site-header', templateUrl: './index.html'})

export class SiteHeaderComponent implements OnInit, DoCheck
{

    constructor(public Auth: TAuthService, @Inject(DOCUMENT) private document: Document, private router: Router)
    {

    }

    ngOnInit()
    {



    }

    ngDoCheck()
    {
        if (this.router.routerState.snapshot.url.indexOf('pro-detail') === 1)
            this.isDetail = true;
        else
            this.isDetail = false;
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
      const number =  this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      if (number > 50) {
            this.navIsFixed = true;
      } else {
            this.navIsFixed = false;
      }

    }

    toggleSidebar()
    {

    }

    rltAndLtr()
    {

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
    isCollapsed: boolean = false;
    isDetail: boolean = false;
    navIsFixed: boolean = false;
}
