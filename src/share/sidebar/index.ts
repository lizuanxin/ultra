import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Route} from '@angular/router';
import {TypeInfo} from 'UltraCreation/Core/TypeInfo';

@Component({selector: 'sidebar', templateUrl: './index.html'})
export class SidebarComponent implements OnInit
{
    constructor(private Route: ActivatedRoute)
    {
    }

    ngOnInit(): void
    {
        let Config = this.Route.snapshot.routeConfig as any;

        if (TypeInfo.Assigned(Config.data))
        {
            const Menu: IMenuItem = {
                LangId: Config.data.LangId + '.title',
                Icon: Config.data.Icon,
                Role: Config.data.Role,
                Children: new Array<IMenuItem>()
            };
            console.log(Menu);

            Config.children.forEach(SubConfig => {
                if (TypeInfo.Assigned(SubConfig.data))
                Menu.Children.push({
                    LangId: Config.data.LangId + '.' + SubConfig.data.LangId + '.title',
                    Icon: SubConfig.data.Icon,
                    Link: SubConfig.path,
                    Role: SubConfig.data.Role});
            });

            this.MenuEntries.push(Menu);
        }
    }

    sidebarClose()
    {
        const dom: any = document.querySelector('body');
        if (dom.classList.contains('push-right')) dom.classList.remove('push-right');
    }

    App = window.App;
    MenuEntries = new Array<IMenuItem>();
}

interface IMenuItem
{
    Link?: string;

    Icon?: string;
    LangId: string;
    Role: string;

    Children?: Array<IMenuItem>;
}
