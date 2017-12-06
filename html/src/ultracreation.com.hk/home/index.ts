import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({templateUrl: './index.html'})
export class HomePage implements OnInit
{
    constructor()
    {

    }
    ngOnInit()
    {
        const dom: any = document.querySelector('body');
        dom.className = 'violet';
    }

}
