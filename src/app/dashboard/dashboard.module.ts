import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { UsersModule } from './users/users.module';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AppMaterialModule,
    UsersModule,
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
