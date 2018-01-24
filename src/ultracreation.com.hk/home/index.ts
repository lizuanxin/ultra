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
       {
            for (let item of list)
            {
                if (item.Item['AvatarUrl'] === null) item.Item['AvatarUrl'] = 'assets/images/pic-big-empty.gif';
            }
            this.Items = list;
            console.log(this.Items);
       })
       .catch(err => console.log(err));

    }

    Items: Array<Types.IPublished>;
}
