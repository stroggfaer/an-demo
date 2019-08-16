import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Category} from '../../shared/model/category.model';
import {CategoriesService} from '../../shared/services/categories.service';
import {Message} from '../../../shared/model/message.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'wfm-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit, OnDestroy {

  @Input() categories: Category[] = [];
  @Output() onCategoryEdit = new EventEmitter<Category>();

  currentCategoryId = 1;
  currentCategory: Category;
  message: Message;

  sub1: Subscription;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
     this.onCategoryChange(); // Инилизация метод для выпадашки;
     this.message = new Message('success', '');
  }

  ngOnDestroy() {
     if (this.sub1) { this.sub1.unsubscribe(); }
  }

  onCategoryChange() {
    // Если текущие id равно категорие то выводим данные;
     this.currentCategory = this.categories.find(c => c.id === +this.currentCategoryId);
  }

  onSubmit(form: NgForm) {
    let {capacity, name} = form.value;
    if (capacity < 0) capacity *= -1;

    const category = new Category(name, capacity, +this.currentCategoryId)

    this.sub1 = this.categoriesService.updateCategory(category)
        .subscribe((category: Category) => {
           this.onCategoryEdit.emit(category);
           this.message.text = 'Категория успешно отредактирована';
           window.setTimeout(() => this.message.text = '', 5000);
        });
  }

}
