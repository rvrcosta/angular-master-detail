import { Component, OnInit } from '@angular/core';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  categories: Category[]=[];

  constructor(private categoryService:CategoryService) { }

  ngOnInit(): void {

    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      error=> alert('Erro ao carregar a lista')
    )
  }

  deleteCategory(category){
    const mustDelete = confirm('Deseja realmente excluir este item?')

    if(mustDelete){
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category),
        error=> alert('Erro ao excluir da lista')
      )
    }
  }

}
