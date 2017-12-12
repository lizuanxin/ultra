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
        this.getChildrenNode(this.Route.snapshot.routeConfig);
    }

    getChildrenNode(NodeItem: any)
    {
        if (TypeInfo.Assigned(NodeItem.data))
        {
            let _item: IMenuItem = {
                Icon: NodeItem.data.Icon,
                Role: NodeItem.data.Icon,
                LangId: NodeItem.data.LangId,
                Children: new Array<IMenuItem>()
            };

            NodeItem.children.forEach(item => {
                if (TypeInfo.Assigned(item.data))
                {
                    item.data.Link = item.path;
                    _item.Children.push(item.data);
                }
            });

            this.MenuEntries.push(_item);

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
