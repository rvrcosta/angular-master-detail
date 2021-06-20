import { Component, Injector, OnInit } from '@angular/core';
import {  Validators } from '@angular/forms';

import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from './../../categories/shared/category.service';


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix:','
  };

   constructor(
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector,new Entry(),entryService, Entry.fromJson)
   }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadCategories();

  }

  get typeOptions():Array<any>{

    return Object.entries(Entry.types).map(
      ([value,text]) => {
        return{
          text: text,
          value: value
        }
      }
    );
  }

  protected createPageTitle(): string{
    return "Cadastro de novo lançamento";
  }

  protected editPageTitle(): string{
    const resourceName = this.resource.name || "";
    return "Editando o lançamento: " + resourceName;
  }


  protected buildResourceForm(){
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }


  protected loadCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }


}
