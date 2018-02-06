import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as Types from 'services/cloud/types';
import {TDomainService} from 'services/domain';

@Component({templateUrl: './index.html'})
export class ProCenterPage implements OnInit
{
    constructor(private DomainService: TDomainService)
    {
        this.Items = [];
    }

    ngOnInit()
    {
       this.DomainService.List().then(list =>
        {
            this.Items = list;
            console.log(this.Items);
        })
       .catch(err => console.log(err));
    }

    Items: Array<Types.IPublishedSnap>;
}
