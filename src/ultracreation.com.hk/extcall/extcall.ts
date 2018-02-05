import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Types} from 'services';
import { TDomainService} from 'services/domain';
import { TypeInfo } from 'UltraCreation/Core/TypeInfo';


@Component({selector: 'app-extcall-page', templateUrl: './extcall.html'})

export class ExtCalllPage implements OnInit {
    constructor(private route: ActivatedRoute, private DomainService: TDomainService)
    {

    }
    ngOnInit()
    {

        this.DomainService.Open(this.route.params['value'].id).then(item =>
        {
            if (TypeInfo.Assigned(item))
            {
                this.Pictures = item.Item['Pictures'];
            }
        })
        .catch(err => console.log(err));

    }

    Pictures: Types.IPicture;

}
