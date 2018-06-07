import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from '../../app-material/app-material.module';
import { UsersDashboardService } from './shared/users-dashboard.service';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';


@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    AppMaterialModule,
  ],
  declarations: [UsersComponent],
  providers: [UsersDashboardService]
})
export class UsersModule { }
