import { Component, OnInit } from '@angular/core';
import {TypeInfo} from 'UltraCreation/Core';


@Component({
    selector: 'app-products-configure',
    templateUrl: './classified.component.html',
})



export class ClassifiedComponent implements OnInit {

    constructor()
    {


    }

    ngOnInit()
    {

    }

    Open(content: Object)
    {

        // App.Modal.open(content).result
        //     .then(ok =>
        //     {

        //     })
        //     .catch(err => {});
    }

    selectTarget(e: any)
    {
        if (e.target.className === 'unvisible-icon')
            e.target.className = 'visible-icon';
        else
            e.target.className = 'unvisible-icon';
        // e.target.classList.toggle('unvisible-icon');
        if (e.target)
        {
            setTimeout(function()
            {
                // e.target.setSelectionRange(0, e.target.value.length);
            }, 1);
        }
    }


    App = window.App;
}
