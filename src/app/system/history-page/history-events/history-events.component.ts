import {Component, Input, OnInit} from '@angular/core';
import {Category} from '../../shared/model/category.model';
import {WFMEvent} from '../../shared/model/event.model';

@Component({
  selector: 'wfm-history-events',
  templateUrl: './history-events.component.html',
  styleUrls: ['./history-events.component.scss']
})
export class HistoryEventsComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Input() events: WFMEvent[] = [];
  searchValue = '';
  serchPlaceholder = 'Сумма';
  searchField = 'amount';

  constructor() { }

  ngOnInit() {
    this.events.forEach((e) => {
       if (e.category) {
           e.catName = this.categories.find(c => c.id === e.category).name;
       } else {
           e.catName = 'Нет';
       }
    });
  }

  getEventClass(e: WFMEvent) {
      return {
         'label': true,
         'label-danger': e.type === 'outcome',
         'label-success': e.type === 'income'
      };
  }

  changeCriteria(field: string) {
      const namesMap = {
          amount: 'Сумма',
          date: 'Дата',
          category: 'Категория',
          type: 'Тип'
      };
      this.serchPlaceholder = namesMap[field];
      this.searchField = field;
  }

}
