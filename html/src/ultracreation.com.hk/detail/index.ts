import {Component, OnInit, Inject, HostListener} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';

@Component({templateUrl: './index.html'})
export class DetailPage implements OnInit
{
    constructor(@Inject(DOCUMENT) private document: Document)
    {

    }
    ngOnInit()
    {
        const dom: any = document.querySelector('body');
        dom.className = '';
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
      const number =  this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

      if (number > 50) {
            this.tabIsFixed = true;
      } else {
            this.tabIsFixed = false;
      }

    }

    tabIsFixed: boolean = false;

}
