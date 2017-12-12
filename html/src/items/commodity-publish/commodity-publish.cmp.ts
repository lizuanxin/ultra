import {Component, OnInit} from '@angular/core';

import {TypeInfo} from 'UltraCreation/Core';
import { ActivatedRoute } from '@angular/router';
import * as Types from 'services/types';
import {TItemService} from 'services/item';


@Component({selector: 'item-commodity-publish', templateUrl: './commodity-publish.cmp.html'})
export class CommodityPublishComponent implements OnInit
{

    constructor(private Items: TItemService, private route: ActivatedRoute)
    {
    }

    ngOnInit()
    {

        this.ProObj = new Object() as Types.IProduct;
        this.route.params.subscribe(params =>
        {
            this.HeadTitle = this.setTitle(this.ProId = params['Id']);
            this.Items.List().then(list =>
            {
                list.forEach(V =>
                {
                    if (V.Id.toString() === params['Id']) this.ProObj = V;
                });
            });
        });

        setTimeout(() => {
            this.editorContent = 'content changed!';
            // console.log('you can use the quill instance object to do something', this.editor);
            // this.editor.disable();
          }, 2800);

    }

    setTitle(id: string): string
    {
        if (id === '') return App.Translate('items.commodity.button.add') + App.Translate('items.commodity.field.goods');
        return App.Translate('items.commodity.button.edit') + App.Translate('items.commodity.field.goods');
    }

    Save()
    {

        if (this.ProId === '')
        {
            // this.Items.AppendProduct(this.ProObj)
            // .then(() => App.location.back())
            // .catch(err => console.log(err));
        }
        else
        {
            // this.Items.Update(this.ProObj)
            // .then(() => App.location.back())
            // .catch(err => console.log(err));
        }

    }



    src: string = '';
    App = window.App;
    HeadTitle: string;
    ProId: string;
    ProObj: Types.IProduct;


    public editorContent = 'I am Example content';
    public editorOptions = {
      placeholder: 'insert content...'
    };
}
