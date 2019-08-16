import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import  * as moment from 'moment';
import {CategoriesService} from '../shared/services/categories.service';
import {EventsService} from '../shared/services/events.service';
import {Subscription} from 'rxjs/Subscription';

import {Category} from '../shared/model/category.model';
import {WFMEvent} from '../shared/model/event.model';


@Component({
  selector: 'wfm-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  constructor(private categoriesService: CategoriesService,
              private eventService: EventsService) { }

  isLoaded = false;
  s1: Subscription;

  categories: Category[] = [];
  events: WFMEvent[] = []; // Оргинал евент;
  filteredEvents: WFMEvent[] = []; // Дубликат евент;

  isFilterVisible = false;

  chartData = [];

  ngOnInit() {
     this.s1 = Observable.combineLatest(
         this.categoriesService.getCategories(),
         this.eventService.getEvents()
     ).subscribe((data: [Category[], WFMEvent[]]) => {
         this.categories = data[0];
         this.events = data[1];

         this.setOriginalEvents();
         this.calculateChartData();

         this.isLoaded = true;
     });
  }

  // Редактирование евент не затрагивая оргинала;
  private setOriginalEvents() {
      this.filteredEvents = this.events.slice();
  }

  // Данные для графика;
  calculateChartData(): void {
    this.chartData = [];
    this.categories.forEach((cat) => {
      const catEvent = this.filteredEvents.filter((e) => e.category === cat.id && e.type === 'outcome');
      this.chartData.push({
         name: cat.name,
         value: catEvent.reduce((total, e) => {
           total += e.amount;
           return total;
         }, 0)
      });
    });
  }

  /*-----Filetrs Modal----*/

    private toggleFilterVisibility(dir: boolean) {
        this.isFilterVisible = dir;
    }

    openFilter() {
        this.toggleFilterVisibility(true);
    }
    // После кнопка применит получаем данные с Евента;
    onFilterApply(filterData) {
       this.toggleFilterVisibility(false);
       this.setOriginalEvents();

       const startPeriod = moment().startOf(filterData.period).startOf('d');
       const endPeriod = moment().startOf(filterData.period).endOf('d');

       // Фильтруем значение то что пирходит с евента;
       this.filteredEvents = this.filteredEvents
           .filter((e) => {
               return filterData.types.indexOf(e.type) !== -1;
           })
           .filter((e) => {
               return filterData.categories.indexOf(e.category.toString()) !== -1;
           })
           .filter((e) => {
               const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
               return momentDate.isBetween(startPeriod, endPeriod);
           });

       this.calculateChartData();
    }

    onFilterCancel() {
       this.toggleFilterVisibility(false);
       this.setOriginalEvents(); // Инилизируем;
       this.calculateChartData(); // Перерисуем граффик;
    }


    ngOnDestroy() {
        if (this.s1) {
            this.s1.unsubscribe();
        }
    }
}
