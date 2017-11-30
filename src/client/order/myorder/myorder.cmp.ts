import { Component, OnInit } from '@angular/core';

const Query_Field = [
    { name: '订单号' },
    { name: '收件人' },
    { name: '手机' },

];

const Data_List = [
    { num: '20685555266602', name: '秦姬', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXXXXXXXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'},
    { num: '20685555266602', name: '秦姬', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'},
    { num: '20685555266602', name: '秦姬', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'},
    { num: '20685555266602', name: '秦姬', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'},
    { num: '20685555266602', name: '秦姬', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'},
    { num: '20685555266602', name: '秦姬', tel: '13959613000', mail: '13959613000@139.com', amount: '1000.00', freight: '0.0', status: '未发货', add: '广东省珠海市XXXXXXXXXXX', orderDate: '2017-05-22', payDate: '2017-05-22'}
];

@Component({
    selector: 'my-order',
    templateUrl: './myorder.cmp.html',
})



export class MyorderComponent implements OnInit
{
    constructor()
    {

        this.QueryField = Query_Field;
        this.SimData = Data_List;

    }

    ngOnInit()
    {

    }


    Open(content: Object)
    {

        // App.Modal.open(content, {size: 'lg'}).result
        //     .then(ok =>
        //     {

        //     })
        //     .catch(err => {});
    }


    QueryField: Array<object>;
    SimData: Array<object>;

    App = window.App;
    // page = 1;

}
