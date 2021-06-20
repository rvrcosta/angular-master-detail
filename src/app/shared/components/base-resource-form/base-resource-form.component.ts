
import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseResourceModel } from '../../models/base-resource';
import { BaseResourceService } from '../../services/base-resource.service';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';


export abstract class BaseResourceFormComponent <T extends BaseResourceModel> implements OnInit,AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serveErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData)=> T

  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction =='new'){
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  //Private methores

  protected setCurrentAction(){
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  protected loadResource(){
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get("id")))
      ).subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(this.resource);
        },
        (error) => alert ('Ocorreu um erro, tente mais tarde.')
      )
    }
  }

  protected setPageTitle(){
    if(this.currentAction == 'new'){
      this.pageTitle = this.createPageTitle();
    } else {
      this.pageTitle = this.editPageTitle();
    }
  }

  protected createPageTitle():string{
    return 'Novo';
  }

  protected editPageTitle():string{
    return 'Editando';
  }

  protected createResource(){
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.create(resource)
    .subscribe(
      resource => this.actionsForSucess(resource),
      error => this.actionsForError(error)
    )
  }

  protected updateResource(){
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.update(resource)
    .subscribe(
      resource => this.actionsForSucess(resource),
      error => this.actionsForError(error)
    )

  }

  protected actionsForSucess(resource:T){

    toastr.success("Solicitação processada com sucesso.");

    const baseComponentPath:string = this.route.snapshot.parent.url[0].path;

    //Redirect / reload page com skipLocationChange que não grava no histórico o redirecionamento
    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
      () => this.router.navigate([baseComponentPath,resource.id,"edit"])
    );

  }

  protected actionsForError(error){
    toastr.error("Ocorreu um erro ao processar a requisição");
    this.submittingForm = false;
    if(error.status === 422)
      this.serveErrorMessages = JSON.parse(error._body).errors;
    else
      this.serveErrorMessages = ['Falha na comunicação com o servidor. Por favor, teste mais tarde.']
  }

  protected abstract buildResourceForm():void;

}
