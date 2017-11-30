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
        App.Router.config.forEach(RootRoute =>
        {

            if (! TypeInfo.Assigned(RootRoute.canActivate))
                return;
            if (! TypeInfo.Assigned(RootRoute.data))
                return;

            const data = RootRoute.data as any;

            const LangId = data.LangId;
            const Menu: IMenuItem = {Icon: data.Icon, Role: data.Role,
                LangId: LangId + './title',
                Link: '/' + RootRoute.path,
            };

            Menu.LangId = LangId + '.title';
            Menu.Link = '/' + RootRoute.path;


            if (this.Route.snapshot.data.LangId === LangId)
            {
                Menu.Children = new Array<IMenuItem>();

                for (const SubRoute of this.Route.snapshot.routeConfig.children)
                {
                    if (! TypeInfo.Assigned(SubRoute.data))
                        continue;

                    const data = SubRoute.data as any;
                    const SubLangId = data.LangId;

                    if (!TypeInfo.Assigned(data.IsShow))
                    {
                        const SubMenu: IMenuItem = {Icon: data.Icon, Role: data.Role,
                            LangId: LangId + '.' + SubLangId + '.title',
                            Link: Menu.Link + '/' + SubRoute.path};

                        Menu.Children.push(SubMenu);
                    }
                }
            }

            this.MenuEntries.push(Menu);

        });
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
    Link: string;

    Icon?: string;
    LangId: string;
    Role: string;

    Children?: Array<IMenuItem>;
}
