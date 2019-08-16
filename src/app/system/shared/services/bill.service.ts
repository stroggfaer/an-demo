import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Bill} from '../model/bill.model';
import {BaseApi} from '../../../shared/core/base-api';

@Injectable()
// Валюта и счет;
export  class BillService extends BaseApi {
    constructor(
        public  http: Http
    ) {
        super(http);
    }

    getBill(): Observable <Bill> {
        return this.get('bill');
    }
    // Обновить счет;
    updateBill(bill: Bill): Observable<Bill> {
        return this.put('bill', bill);
    }

    getCurrency(base = 'RUB'): Observable <any>  {
        return this.http.get(`http://api.fixer.io/latest?base=${base}`)
            .map((response: Response) => {
                return response.json();
            });
    }
}