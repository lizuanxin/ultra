import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as Types from 'services/cloud/types';
import {TDomainService} from 'services/domain';

@Component({templateUrl: './index.html'})
export class HomePage implements OnInit
{
    constructor(private DomainService: TDomainService)
    {
        this.Items = [];
    }

    ngOnInit()
    {
       this.DomainService.List().then(list =>
            this.Items = list)
       .catch(err => console.log(err));

    }

    Items: Array<Types.IPublishedSnap>;
}
