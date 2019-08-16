import { Component, OnInit } from '@angular/core';
import {Category} from '../shared/model/category.model';
import {CategoriesService} from '../shared/services/categories.service';

@Component({
  selector: 'wfm-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent implements OnInit {

  categories: Category[] = [];
  isLoaded = false;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
      this.categoriesService.getCategories()
          .subscribe((categories: Category[]) => {
              this.categories = categories;
              this.isLoaded = true;
          });
  }

  // Add Categories;
  newCategoryAdded(category: Category) {
     // add to array;
      this.categories.push(category);
  }

  categoryWasEdited(category: Category) {
      const idx = this.categories
          .findIndex(c => c.id === category.id);
      this.categories[idx] = category;
  }
}
