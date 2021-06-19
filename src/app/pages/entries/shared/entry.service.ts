
import { Injectable, Injector } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { Entry } from './entry.model';
import { CategoryService } from './../../categories/shared/category.service';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';


@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected injector: Injector,
    private categoryService: CategoryService) {
      super('api/entries',injector,Entry.fromJson)
   }

   create(entry: Entry):Observable<Entry>{

    return this.setCategoryAndSendtoServer(entry, super.create.bind(this))
   }

   update(entry: Entry):Observable<Entry>{

    return this.setCategoryAndSendtoServer(entry, super.update.bind(this))


   }

   private setCategoryAndSendtoServer(entry: Entry, sendFn: any):Observable<Entry>{

    return this.categoryService.getById(entry.categoryId).pipe(
      mergeMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError)
    );

   }

}
