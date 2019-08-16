import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'wfmFilter'
})

export class FilterPipe implements PipeTransform {
    transform(items: any, value: string, field: string): any {
       // Если равняется 0 то выводим все;
       if (items.length === 0 || !value) {
           return items;
       }
       return items.filter((i) => {
           const t = Object.assign({}, i);  // TODO: Делаем глубокий копии объекта и наче перезаписывает эвент значение;
           // Проверка на Суммы;
           if (!isNaN(t[field])) {
               t[field] += '';
           }
           // Проверка по типу:
           if (field === 'type') {
               t[field] = t[field] === 'income' ? 'доход' : 'расход';
           }
           // Проверка по категорий
           if (field === 'category') {
               t[field] = t['catName'];
           }

           return t[field].toLowerCase().indexOf(value.toLowerCase()) !== -1; // проверка на Регистр toLowerCase
       });
    }
}
