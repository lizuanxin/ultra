/** Documents:
 *      https://valor-software.com/ngx-bootstrap/#/
 */
import {NgModule} from '@angular/core';
import * as NgxBootstrap from 'ngx-bootstrap';

@NgModule({
    imports: [
        NgxBootstrap.AccordionModule.forRoot(),
        NgxBootstrap.AlertModule.forRoot(),
        NgxBootstrap.ButtonsModule.forRoot(),
        NgxBootstrap.CarouselModule.forRoot(),
        NgxBootstrap.CollapseModule.forRoot(),
        NgxBootstrap.DatepickerModule.forRoot(),
        NgxBootstrap.BsDropdownModule.forRoot(),
        NgxBootstrap.ModalModule.forRoot(),
        NgxBootstrap.PaginationModule.forRoot(),
        NgxBootstrap.PopoverModule.forRoot(),
        NgxBootstrap.ProgressbarModule.forRoot(),
        NgxBootstrap.RatingModule.forRoot(),
        NgxBootstrap.SortableModule.forRoot(),
        NgxBootstrap.TabsModule.forRoot(),
        NgxBootstrap.TimepickerModule.forRoot(),
        NgxBootstrap.TooltipModule.forRoot(),
        NgxBootstrap.TypeaheadModule.forRoot(),
    ],
    exports: [
        NgxBootstrap.AccordionModule,
        NgxBootstrap.AlertModule,
        NgxBootstrap.ButtonsModule,
        NgxBootstrap.CarouselModule,
        NgxBootstrap.CollapseModule,
        NgxBootstrap.DatepickerModule,
        NgxBootstrap.BsDropdownModule,
        NgxBootstrap.ModalModule,
        NgxBootstrap.PaginationModule,
        NgxBootstrap.PopoverModule,
        NgxBootstrap.ProgressbarModule,
        NgxBootstrap.RatingModule,
        NgxBootstrap.SortableModule,
        NgxBootstrap.TabsModule,
        NgxBootstrap.TimepickerModule,
        NgxBootstrap.TooltipModule,
        NgxBootstrap.TypeaheadModule
    ]
})
export class NgxBootstrapModule
{
}
