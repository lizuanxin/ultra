import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';

@Component({templateUrl: './index.html'})
export class CableMagicPage implements OnInit
{
    constructor()
    {

    }
    ngOnInit()
    {
        const dom: any = document.querySelector('body');
        dom.className = '';
    }

}
