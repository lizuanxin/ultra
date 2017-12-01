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
})
export class NgxBootstrapModule
{
}
