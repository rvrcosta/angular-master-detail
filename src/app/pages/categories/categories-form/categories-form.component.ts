
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoryService } from './../shared/category.service';
import { Category } from './../shared/category.model';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';


@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit,AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serveErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categorieService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();

  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction =='new'){
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  //Private methores

  private setCurrentAction(){
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  private buildCategoryForm(){
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory(){
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.categorieService.getById(+params.get("id")))
      ).subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(this.category);
        },
        (error) => alert ('Ocorreu um erro, tente mais tarde.')
      )
    }
  }

  private setPageTitle(){
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastro de nova categoria';
    } else {
      const categoryName = this.category.name || "";
      this.pageTitle = "Editando Categoria:   " + categoryName;
    }
  }

  private createCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categorieService.create(category)
    .subscribe(
      category => this.actionsForSucess(category),
      error => this.actionsForError(error)
    )
  }

  private updateCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categorieService.update(category)
    .subscribe(
      category => this.actionsForSucess(category),
      error => this.actionsForError(error)
    )

  }

  private actionsForSucess(category:Category){

    toastr.success("Solicitação processada com sucesso.");

    //Redirect / reload page com skipLocationChange que não grava no histórico o redirecionamento
    this.router.navigateByUrl("/categories", {skipLocationChange: true}).then(
      () => this.router.navigate(["/categories",category.id,"edit"])
    );

  }

  private actionsForError(error){
    toastr.error("Ocorreu um erro ao processar a requisição");
    this.submittingForm = false;
    if(error.status === 422)
      this.serveErrorMessages = JSON.parse(error._body).errors;
    else
      this.serveErrorMessages = ['Falha na comunicação com o servidor. Por favor, teste mais tarde.']
  }

}
