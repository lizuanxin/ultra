import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Types} from 'services';
import {SwiperComp} from 'UltraCreation/ng-ion/swiper';
import {TDomainService} from 'services/domain';
import { TypeInfo } from 'UltraCreation/Core/TypeInfo';


@Component({selector: 'app-productdetail-page', templateUrl: './index.html'})
export class ProDetailPage implements OnInit {
    constructor(private elementRef: ElementRef, private renderer: Renderer, private router: Router, private route: ActivatedRoute, private DomainService: TDomainService)
    {

    }
    ngOnInit()
    {

        this.DomainService.Open(this.route.params['value'].id).then(item =>
        {
            if (TypeInfo.Assigned(item))
            {
                this.AvatarUrl = item.Item['AvatarUrl'];
                this.PublishedItem = item.Item as Types.IItem;
                this.PublishedPrice = (item.Item as Types.IItem).PricingList[0] as Types.ILocalizedPricing;
                this.PublishedPic = (item.Item as Types.IItem).Pictures as Array<Types.IPicture>;
                this.ThumbsSwiper.Update();
                this.LeftViewListen();
                console.log(this.PublishedItem);
            }
        })
        .catch(err => console.log(err));

    }

    SlideClick(item, $index)
    {
        this.AvatarUrl = item.Path;
        this.CurrentIndex = $index;
    }

    AddSubQty(n: string)
    {
        if (n === '-' && this.Quantity > 1)
        {
            this.Quantity --;
        }
        else if (n === '+')
        {
            this.Quantity ++;
        }
    }

    AddCart()
    {
        // this.ObjClone();
        setTimeout(() => this.router.navigate(['/cart']));

    }

    LeftViewListen()
    {

        this.LeftView.nativeElement.addEventListener('mouseover', this.MouseHandler.bind(this));
        this.LeftView.nativeElement.addEventListener('mouseout', this.MouseHandler.bind(this));
        this.LeftView.nativeElement.addEventListener('mousemove', this.MouseHandler.bind(this));

    }


    CalculateMaskWH()
    {
        let mask_width = this.LeftView.nativeElement.clientWidth / this.BigImg.nativeElement.clientWidth * this.RightView.nativeElement.clientWidth;
        let mask_height = this.LeftView.nativeElement.clientHeight / this.BigImg.nativeElement.clientHeight * this.RightView.nativeElement.clientHeight;
        this.Mask.nativeElement.style.width = mask_width + 'px';
        this.Mask.nativeElement.style.height = mask_height + 'px';

   }


    private MouseHandler(e: MouseEvent): void
    {
        let view_width = this.LeftView.nativeElement.clientWidth;
        let view_height = this.LeftView.nativeElement.clientHeight;

        this.CalculateMaskWH();
        switch (e.type)
        {
            case 'mouseover':
                this.RightView.nativeElement.style.display = 'block';
                this.Mask.nativeElement.style.display = 'block';
                break;

            case 'mouseout':
                this.RightView.nativeElement.style.display = 'none';
                this.Mask.nativeElement.style.display = 'none';
                break;

            case 'mousemove':

                let left = e.pageX - e.movementX - this.Mask.nativeElement.clientWidth / 2;
                let top = e.pageY -  e.movementY - this.Mask.nativeElement.clientHeight / 2;

                if (left < 0)
                {
                    left = 0;
                }
                else if (left > e.clientX - this.Mask.nativeElement.clientWidth)
                {
                    left = e.clientX - this.Mask.nativeElement.clientWidth;
                }

                if (top < 0){
                    top = 0;
                }
                else if (top > e.clientY - this.Mask.nativeElement.clientHeight)
                {
                    top = e.clientY - this.Mask.nativeElement.clientHeight;
                }

                this.Mask.nativeElement.style.left = left + 'px';
                this.Mask.nativeElement.style.top = top + 'px';

                let rate = this.BigImg.nativeElement.clientWidth / view_width;
                this.BigImg.nativeElement.style.left = - rate * left + 'px';
                this.BigImg.nativeElement.style.top = - rate * top + 'px';

                break;
        }
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

    PublishedItem = new Object() as Types.IItem;
    PublishedPic = new Array<Types.IPicture>();
    PublishedPrice = new Object() as Types.ILocalizedPricing;
    CurrentIndex: number = 0;
    AvatarUrl: string = null;
    Quantity: number = 1;
    StyleGalleryClone: object = {};
    @ViewChild('ThumbsSwiper') private ThumbsSwiper: SwiperComp;
    @ViewChild('leftview') private LeftView: ElementRef;
    @ViewChild('rightview') private RightView: ElementRef;
    @ViewChild('bigImg') private BigImg: ElementRef;
    @ViewChild('mask') private Mask: ElementRef;

}
