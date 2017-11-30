import {Component, OnInit, DoCheck} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-pages',
    templateUrl: '../share/layout.domain.html'
})
export class UltraCreationComponent implements OnInit, DoCheck
{
    constructor(public router: Router) { }

    ngOnInit()
    {

    }
    ngDoCheck()
    {
        if (this.router.url === '/') {
            this.router.navigate(['/home']);
        }
    }


}
