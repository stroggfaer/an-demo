import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';

import {Category} from '../../shared/model/category.model';
import {WFMEvent} from '../../shared/model/event.model';
import {EventsService} from '../../shared/services/events.service';
import {BillService} from '../../shared/services/bill.service';
import {Bill} from '../../shared/model/bill.model';
import {Message} from '../../../shared/model/message.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'wfm-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {
  // Отписание от подписки;
  sub1: Subscription;
  sub2: Subscription;
  @Input() categories: Category[] = [];

  types = [
      {type: 'income', label: 'Доход'},
      {type: 'outcome', label: 'Расход'},
  ];

  message: Message;

  constructor(private eventsService: EventsService,
              private billService: BillService) { }

  ngOnInit() {
      this.message = new Message('danger', '');
  }

  ngOnDestroy() {
      if (this.sub1) { this.sub1.unsubscribe(); }
      if (this.sub2) { this.sub1.unsubscribe(); }
  }

  private showMessage(text: string) {
      this.message.text = text;
      window.setTimeout(() => this.message.text = '', 5000);
  }


  onSubmit(form: NgForm) {
       let {amount, description, category, type} = form.value;
       if (amount < 0) amount *= -1;
        console.log(form);
        // Перечисляем поля с БД;
       const event = new WFMEvent(
           type, amount, +category, moment().format('DD.MM.YYYY HH:mm:ss'), description
       );

       this.sub1 = this.billService.getBill()
           .subscribe((bill: Bill) => {
               let value = 0;
               if (type === 'outcome') {
                  if (amount > bill.value) {
                      // Error
                      this.showMessage(`На счету недостаточно средств. Вам нехватает ${amount - bill.value}`)
                      return;
                  } else {
                      value = bill.value - amount;
                  }
               } else {
                   value = bill.value + amount;
               }
               // Персчет;
               this.sub2 = this.billService.updateBill({value, currency: bill.currency})
                   .mergeMap(() => this.eventsService.addEvent(event))  // Что бы два раза не подписывать методы используется mergeMap;
                   .subscribe(() => {
                       // Очистить поле после завершение;
                       form.setValue({
                           amount: 0,
                           description: ' ',
                           category: 1,
                           type: 'outcome'
                       });
                   });
           });


  }
}
