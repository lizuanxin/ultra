import {Component, OnInit, TemplateRef } from '@angular/core';
import {TypeInfo, THttpClient} from 'UltraCreation/Core';

const Data_List = [
    { num: '20685555266602', name: 'xxxx', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXXXXXXXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'},
    { num: '20685555266602', name: 'xxxx', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'},
    { num: '20685555266602', name: 'xxxx', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'},
    { num: '20685555266602', name: 'xxxx', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'},
    { num: '20685555266602', name: 'xxxx', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'},
    { num: '20685555266602', name: 'xxxx', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'}
];

@Component({selector: 'doll-room', templateUrl: './index.html'})
export class OrderListComponent implements OnInit
{
    constructor()
    {
        this.DataList = Data_List;
    }

    ngOnInit()
    {

    }

    DataList: Array<object>;

}

