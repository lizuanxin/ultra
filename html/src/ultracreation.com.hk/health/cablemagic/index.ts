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

        // const dom: any = document.querySelector('#ShowVideoSwiper > div');
        // const dom2: any = document.querySelector('#FileSwiper > div');

        // const fileswiper = new Swiper(this.FileSwiper.Ref.nativeElement.querySelector('swiper > div'));
        // const showvideoswiper = new Swiper(this.ShowVideoSwiper.Ref.nativeElement.querySelector('swiper > div'));
        // console.log(this.FileSwiper.Ref.nativeElement.querySelector('swiper > div'));

        // fileswiper.params.control = showvideoswiper;
        // showvideoswiper.params.control = fileswiper;
        // this.FileSwiper.Config.control = this.ShowVideoSwiper.Ref.nativeElement.querySelector('swiper > div');


    }

    get ActiveIndex(): number
    {
        console.log(this.FileSwiper.ActiveIndex);
        return this.FileSwiper.ActiveIndex;
    }

    @ViewChild('FileSwiper') private FileSwiper: SwiperComp;

}
