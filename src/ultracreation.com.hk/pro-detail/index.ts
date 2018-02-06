import { Component, OnInit, ViewChild, ElementRef, Renderer, Inject, HostListener } from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Types} from 'services';
import {SwiperComp} from 'UltraCreation/ng-ion/swiper';
import {TDomainService} from 'services/domain';
import { TypeInfo } from 'UltraCreation/Core/TypeInfo';
import { TShoppingCart } from 'services/shopping_cart';


@Component({selector: 'app-productdetail-page', templateUrl: './index.html'})
export class ProDetailPage implements OnInit {
    constructor(private elementRef: ElementRef, private renderer: Renderer, private router: Router,
        private route: ActivatedRoute, private DomainService: TDomainService, private CartSvc: TShoppingCart, @Inject(DOCUMENT) private document: Document)
    {

    }
    ngOnInit()
    {
        console.log(this.route);

        this.DomainService.Open(this.route.params['value'].id).then(item =>
        {
            if (TypeInfo.Assigned(item))
            {
                this.Published = item;
                this.AvatarUrl = item.Item['AvatarUrl'];
                this.PublishedItem = item.Item as Types.IItem;
                this.PublishedPrice = (item.Item as Types.IItem).PricingList[0] as Types.ILocalizedPricing;
                this.PublishedPic = (item.Item as Types.IItem).Pictures as Array<Types.IPicture>;
                // this.ThumbsSwiper.Update();
                // this.LeftViewListen();
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
        this.CartSvc.Add(this.Published);
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


    private MouseHandler(event): void
    {
        let view_width = this.LeftView.nativeElement.clientWidth;
        let view_height = this.LeftView.nativeElement.clientHeight;

        // this.CalculateMaskWH();
        switch (event.type)
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
                event = event || window.event;

                let left = event.clientX - event.movementX - this.Mask.nativeElement.offsetWidth * 3.2;
                let top = event.clientY -  event.movementY - this.Mask.nativeElement.offsetHeight * 2;

                left = left < 0 ? 0 : left;
                left = left > event.offsetWidth - this.Mask.nativeElement.offsetWidth ? event.offsetWidth - this.Mask.nativeElement.offsetWidth : left;
                top = top < 0 ? 0 : top;
                top = top > event.offsetHeight - this.Mask.nativeElement.offsetHeight ? event.offsetHeight - this.Mask.nativeElement.offsetHeight : top;


                this.Mask.nativeElement.style.left = left  + 'px';
                this.Mask.nativeElement.style.top = top  + 'px';

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

    @HostListener('window:scroll', [])
    onWindowScroll() {
      const number =  this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      const footer_link: any = document.querySelector('.most-link') as HTMLElement;
      if (number < footer_link.getBoundingClientRect().top) {
        this.ToolPayFix = true;
      } else {
        this.ToolPayFix = false;
      }

    }

    Published: Types.IPublished;
    PublishedItem = new Object() as Types.IItem;
    PublishedPic = new Array<Types.IPicture>();
    PublishedPrice = new Object() as Types.ILocalizedPricing;
    CurrentIndex: number = 0;
    AvatarUrl: string = null;
    Quantity: number = 1;
    StyleGalleryClone: object = {};
    ToolPayFix: boolean = false;
    @ViewChild('ThumbsSwiper') private ThumbsSwiper: SwiperComp;
    @ViewChild('leftview') private LeftView: ElementRef;
    @ViewChild('rightview') private RightView: ElementRef;
    @ViewChild('bigImg') private BigImg: ElementRef;
    @ViewChild('mask') private Mask: ElementRef;

}
