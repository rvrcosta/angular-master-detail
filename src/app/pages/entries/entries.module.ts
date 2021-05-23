import { NgModule, LOCALE_ID } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { CalendarModule } from 'primeng/calendar';

import { EntriesRoutingModule } from './entries-routing.module';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { IMaskModule } from 'angular-imask';





@NgModule({
  declarations: [
    EntryListComponent,
    EntryFormComponent
  ],
  imports: [
    SharedModule,
    EntriesRoutingModule,
    IMaskModule,
    CalendarModule,
  ],
  providers:[
    {provide: LOCALE_ID, useValue:'pt-BR'}
  ]
})

export class EntriesModule { }
