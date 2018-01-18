import {Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';

@Component({templateUrl: './index.html'})
export class CableMagicPage implements OnInit
{
    constructor(@Inject(DOCUMENT) private document: Document)
    {

    }
    ngOnInit()
    {
        this.document.documentElement.scrollTo({top: 0});
        const dom: any = document.querySelector('body');
        dom.className = '';
    }

}
