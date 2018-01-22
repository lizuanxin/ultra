import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as Types from 'services/cloud/types';
import {TItemService} from 'services';

@Component({templateUrl: './index.html'})
export class HomePage implements OnInit
{
    constructor(private ItemService: TItemService)
    {
        this.Items = [];
    }

    ngOnInit()
    {
        const dom: any = document.querySelector('body');

        this.ItemService.Published('kktYWb9kklZYlL8k')
            .then(list =>
            {
                for (let item of list)
                {
                    if (item.Item['AvatarUrl'] === null) item.Item['AvatarUrl'] = 'assets/images/pic-big-empty.gif';
                }
                this.Items = list;
                console.log(list);

            })
            .catch(err => console.log(err));
    }

    OpenItem(item: Types.IPublished)
    {

    }

    Items: Array<Types.IPublished>;
}
