import { CategoryService } from './../../categories/shared/category.service';

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { Category } from '../../categories/shared/category.model';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit,AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serveErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
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
    private entryService: EntryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();

  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction =='new'){
      this.createEntry();
    } else {
      this.updateEntry();
    }
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

  //Private methores

  private setCurrentAction(){
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  private buildEntryForm(){
    this.entryForm = this.formBuilder.group({
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

  private loadEntry(){
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get("id")))
      ).subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(this.entry);
        },
        (error) => alert ('Ocorreu um erro, tente mais tarde.')
      )
    }
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  private setPageTitle(){
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastro de novo Lançamento';
    } else {
      const entryName = this.entry.name || "";
      this.pageTitle = "Editando Lançamento:   " + entryName;
    }
  }

  private createEntry(){
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry)
    .subscribe(
      entry => this.actionsForSucess(entry),
      error => this.actionsForError(error)
    )
  }

  private updateEntry(){
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry)
    .subscribe(
      entry => this.actionsForSucess(entry),
      error => this.actionsForError(error)
    )

  }

  private actionsForSucess(entry:Entry){

    toastr.success("Solicitação processada com sucesso.");

    //Redirect / reload page com skipLocationChange que não grava no histórico o redirecionamento
    this.router.navigateByUrl("/entrys", {skipLocationChange: true}).then(
      () => this.router.navigate(["/entrys",entry.id,"edit"])
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
