import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'page-footer',
    templateUrl: './footer.cmp.html'
})
export class FooterComponent implements OnInit {

    constructor(private translate: TranslateService) { }

    ngOnInit() {}

    App = window.App;

}
