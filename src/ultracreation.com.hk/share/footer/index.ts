import { Component, OnInit, ViewChild, Inject, HostListener } from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'site-footer',
    templateUrl: './index.html'
})
export class FooterComponent implements OnInit {

    constructor(@Inject(DOCUMENT) private document: Document) { }

    ngOnInit() {}

    OnScrollUp()
    {
        this.ScrollSmooth(this.document.documentElement.scrollTop);
    }

    ScrollSmooth(n: number)
    {
        const timer = setInterval(() =>
        {
            if (n < 100)
                n = 0;
            else
                n = n - 100;

            this.document.documentElement.scrollTo({top: n});
            if (n === 0)
            {
                clearInterval(timer);
            }
        }, 10);
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
      const number =  this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      if (number > 50) {
            this.IsScrollUp = true;
      } else {
            this.IsScrollUp = false;
      }

    }

    App = window.App;
    IsScrollUp: boolean = false;

}
