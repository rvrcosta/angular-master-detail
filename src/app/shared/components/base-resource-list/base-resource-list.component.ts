import { Directive, OnInit } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource';
import { BaseResourceService } from '../../services/base-resource.service';

@Directive()

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[]=[];

  constructor(private resourceService:BaseResourceService<T>) { }

  ngOnInit(): void {

    this.resourceService.getAll().subscribe(
      resources => this.resources = resources,
      error=> alert('Erro ao carregar a lista')
    )
  }

  deleteEntry(resource:T){
    const mustDelete = confirm('Deseja realmente excluir este item?')

    if(mustDelete){
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element != resource),
        error=> alert('Erro ao excluir da lista')
      )
    }
  }

}
