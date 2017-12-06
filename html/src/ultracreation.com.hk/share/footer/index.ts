import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'site-footer',
    templateUrl: './index.html'
})
export class FooterComponent implements OnInit {

    constructor(private translate: TranslateService) { }

    ngOnInit() {}

    App = window.App;

}
