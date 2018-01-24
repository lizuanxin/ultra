import {Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {SwiperComp} from 'UltraCreation/ng-ion/swiper';
// import 'swiper';

@Component({templateUrl: './index.html'})
export class CableMagicPage implements OnInit
{
    constructor(@Inject(DOCUMENT) private document: Document)
    {

    }
    ngOnInit()
    {
        this.document.documentElement.scrollTo({top: 0});
    }

    get ActiveIndex(): number
    {
        console.log(this.FileSwiper.ActiveIndex);
        return this.FileSwiper.ActiveIndex;
    }

    @ViewChild('FileSwiper') private FileSwiper: SwiperComp;

}
