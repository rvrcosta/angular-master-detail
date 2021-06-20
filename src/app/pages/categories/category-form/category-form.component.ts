
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})

export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  category: Category = new Category();

  constructor(
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector,new Category(),categoryService, Category.fromJson)
   }


  protected buildResourceForm(){
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  protected createPageTitle():string{
    return "Cadastro de Nova Categoria";
  }

  protected editPageTitle():string{
    const categoryName = this.resource.name || "";
    return "Edição da Categoria: " + categoryName;
  }

}
