import { ReportsComponent } from './reports/reports.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';


import { ReportsRoutingModule } from './reports-routing.module';


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule,
  ],
  exports:[

  ]
})
export class ReportsModule { }
