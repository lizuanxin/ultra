import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Types} from 'services';
import {SwiperComp} from 'UltraCreation/ng-ion/swiper';
import {TDomainService} from 'services/domain';
import { TypeInfo } from 'UltraCreation/Core/TypeInfo';


@Component({selector: 'app-productdetail-page', templateUrl: './index.html'})
export class ProDetailPage implements OnInit {
    constructor(private elementRef: ElementRef, private renderer: Renderer, private route: ActivatedRoute, private DomainService: TDomainService)
    {

    }
    ngOnInit()
    {

        this.DomainService.Open(this.route.params['value'].id).then(item =>
        {
            if (TypeInfo.Assigned(item)) this.AvatarUrl = item.Item['AvatarUrl'];
            this.PublishedItem = item;
            this.ThumbsSwiper.Update();
            console.log(this.PublishedItem);
        })
        .catch(err => console.log(err));

    }

    SlideClick(item, $index)
    {
        this.AvatarUrl = item.Path;
        this.CurrentIndex = $index;
    }

    AddCart()
    {
        this.ObjClone();

    }

    ObjClone()
    {
        let body = document.querySelector('body');
        let gallery = this.elementRef.nativeElement.querySelector('.gallery-top');
        let galleryRect = this.elementRef.nativeElement.querySelector('.gallery-top').getBoundingClientRect();
        let toGalleryRect = document.getElementById('cart').getBoundingClientRect();


        let tmp = document.createElement('div') as HTMLElement;
        tmp.appendChild(gallery.cloneNode(true));
        body.appendChild(tmp);

        this.renderer.setElementClass(tmp, 'animate', true);
        this.renderer.setElementClass(tmp, 'gallery-clone', true);

        this.renderer.invokeElementMethod(tmp, 'animate',
        [
            [
                {
                    width: galleryRect.width + 'px',
                    height: galleryRect.height + 'px',
                    top: galleryRect.top + 'px',
                    left: galleryRect.left + 'px',
                    right: galleryRect.right + 'px',
                    bottom: galleryRect.bottom + 'px',
                    opacity: 1
                },
                {
                    top: (galleryRect.top - toGalleryRect.top) / 2 + 'px',
                    left: (galleryRect.left + toGalleryRect.left) / 2 + 'px',
                    opacity: 0.5
                },
                {
                    width: toGalleryRect.width + 'px',
                    height: toGalleryRect.height + 'px',
                    top: toGalleryRect.top + 'px',
                    left: toGalleryRect.left + 'px',
                    right: toGalleryRect.right + 'px',
                    bottom: toGalleryRect.bottom + 'px',
                    opacity: 0
                }
            ],
            {
                duration: 600,
                delay: 0,
                fill: 'forwards',
                easing: 'ease',
            }
        ]);
        setTimeout(() => tmp.remove(), 1500);

    }

    PublishedItem: Types.IPublished;
    CurrentIndex: number = 0;
    AvatarUrl: string;
    StyleGalleryClone: object = {};
    @ViewChild('ThumbsSwiper') private ThumbsSwiper: SwiperComp;
}
