import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AuthComponent } from './auth.component';
import { AppMaterialModule } from '../app-material/app-material.module';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    SignupComponent,
    SigninComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppMaterialModule,
    AuthRoutingModule,
  ],
  exports: [
  ]

})
export class AuthModule { }
