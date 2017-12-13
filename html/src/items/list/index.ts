import {Component, OnInit, TemplateRef} from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core';

import {Types} from 'services';
import {TItemService} from 'services/item';

import {BsModalService} from 'ngx-bootstrap';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({selector: 'item-list', templateUrl: './index.html'})
export class ListComponent implements OnInit
{
    constructor(private Items: TItemService, private modalService: BsModalService)
    {
    }

    ngOnInit()
    {
        this.currentPage = 2;
        this.Refresh();
    }

    async Refresh()
    {
        this.List = await this.Items.List().catch(err =>
        {
            return null;
        });
    }


    Remove(): void
    {
        console.log(this.SelectId);
    }

    ToggleSelectAll()
    {
        this.List.forEach(item =>
        {
            if (this.SelectAll)
            {
                item['selected'] = true;
                if (this.SelectId.indexOf(item.Id) === -1) this.SelectId.push(item.Id);
            }
            else {
                item['selected'] = false;
                this.SelectId = [];
            }
        });
    }

    ToggleSelectId(item)
    {
        item['selected'] ? this.SelectId.push(item.Id) : this.SelectId.splice(this.SelectId.indexOf(item.Id), 1);

        if (this.SelectId.length === this.List.length)
            this.SelectAll = true;
        else
            this.SelectAll = false;
    }

    OnPackage()
    {
        console.log(this.SelectId);

    }

    OpenModal(template: TemplateRef<any>, data?: Types.IItem)
    {
        this.ModalProduct = new Object() as any;
        if (TypeInfo.Assigned(data))
        {
            this.ModalTitle = App.Translate('items.operat.edit');
            this.IsEdit = true;
            Object.assign(this.ModalProduct, data);
        }
        else
        {
            this.IsEdit = false;
            this.ModalTitle = App.Translate('items.operat.publish');
        }

        this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    }

    OnSave()
    {
        this.IsEdit ? this.Items.Update(this.ModalProduct) : this.Items.AppendProduct(this.ModalProduct);
        this.modalRef.hide();
        this.modalService.onHide.subscribe((reason: string) => {
            this.Refresh();
        });
    }

    App = window.App;
    Modal: TemplateRef<any>;
    modalRef: BsModalRef;

    ModalTitle: string;
    ModalProduct: Types.IProduct;
    IsEdit: boolean;

    SelectAll: boolean = false;
    SelectId: Array<string> = [];

    currentPage: number;

    List: Array<Types.IItem>;
}
