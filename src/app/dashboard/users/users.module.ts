import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from '../../app-material/app-material.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';


@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    AppMaterialModule,
  ],
  declarations: [UsersComponent]
})
export class UsersModule { }
