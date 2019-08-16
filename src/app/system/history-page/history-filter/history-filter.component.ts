import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Category} from '../../shared/model/category.model';

@Component({
  selector: 'wfm-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent {

  // Получить обратный колбэк;
  @Output() onFilterCancel = new EventEmitter<any>();
  @Output() onFilterApply = new EventEmitter<any>();

  @Input() categories: Category[] = [];

  selectedPeriod = 'd';
  selectedTypes = [];
  selectedCategories = [];

  timePeriods = [
      {type: 'd', label: 'День'},
      {type: 'w', label: 'Неделя'},
      {type: 'M', label: 'Месяц'}
  ];

  types = [
      {type: 'income', label: 'Доход'},
      {type: 'outcome', label: 'Расход'},
  ];

  constructor() { }

  closeFilter() {
     // Чистим полей;
     this.selectedTypes = [];
     this.selectedCategories = [];
     this.selectedPeriod = 'd';

     this.onFilterCancel.emit();
  }

  // Оптимизация код;
  private calculateInputParams(field: string, checked: boolean, value: string) {
      if (checked) {
          this[field].indexOf(value) === -1 ? this[field].push(value) : null;
      } else {
          this[field] = this[field].filter(i => i !== value);
      }
  }

  // Чекбокс получаем два параметры checked val;
  handleChangeType({checked, value}) {
     this.calculateInputParams('selectedTypes', checked, value);
  }

  handleChangeCategory({checked, value}) {
      this.calculateInputParams('selectedCategories', checked, value);
  }
  // Применить и передаем объект в имит;
  applyFilter() {
    this.onFilterApply.emit({
       types: this.selectedTypes,
       categories: this.selectedCategories,
       period: this.selectedPeriod
    });
  }

}
