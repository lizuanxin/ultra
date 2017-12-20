import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'relate',
    templateUrl: './index.html'
})
export class RelateComponent implements OnInit {

    constructor(private translate: TranslateService) { }

    ngOnInit() {}

    App = window.App;

}
