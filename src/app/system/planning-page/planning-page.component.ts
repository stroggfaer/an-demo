import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from '../shared/services/bill.service';
import {CategoriesService} from '../shared/services/categories.service';
import {EventsService} from '../shared/services/events.service';
import {Observable} from 'rxjs/Observable';
import {Category} from '../shared/model/category.model';
import {WFMEvent} from '../shared/model/event.model';
import {Bill} from '../shared/model/bill.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'wfm-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit, OnDestroy {

  isLoaded = false;

  bill: Bill;
  categories: Category[] = [];
  events: WFMEvent[] = [];

  sub1: Subscription;

  constructor(
      private billService: BillService,
      private categoriesService: CategoriesService,
      private eventsService: EventsService
  ) { }

    ngOnInit() {
        // Асенхроный три  запроса на сервер;
       this.sub1 =  Observable.combineLatest(
            this.billService.getBill(),
            this.categoriesService.getCategories(),
            this.eventsService.getEvents()
        ).subscribe((data: [Bill, Category[], WFMEvent[]]) => {
            this.bill = data[0];
            this.categories = data[1];
            this.events = data[2];

            this.isLoaded = true;
        });
    }

    getCategoryCost(cat: Category): number {
       const catEvents = this.events.filter(e => e.category === cat.id && e.type === 'outcome');
       return catEvents.reduce((total, e) => {
         //debugger
         total += e.amount;
         return total;
       }, 0);
    }
    // Для сайт бар вычить процент;
    private getPercent(cat: Category): number {
        const percent = (100 * this.getCategoryCost(cat)) / cat.capacity;
        return percent > 100 ? 100 : percent;
    }
    // Делайем строку;
    getCatPercent(cat: Category): string {
        return this.getPercent(cat) + '%';
    }

    // Сайт бар добавление цвета;
    getCatColorClass(cat: Category): string {
        const percent = this.getPercent(cat);
        return percent < 60 ? 'success' : percent >= 100 ? 'danger' : 'warning';
    }

    ngOnDestroy() {
        if (this.sub1) {
            this.sub1.unsubscribe();
        }
    }

}
