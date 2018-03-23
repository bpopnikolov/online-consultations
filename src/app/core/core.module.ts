import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AppMaterialModule } from '../app-material/app-material.module';
import { AppRoutingModule } from '../app-routing.module';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { SettingsComponent } from './settings/settings.component';
import { GeneralComponent } from './settings/general/general.component';
import { SettingsService } from './settings/settings.service';
import { PasswordChangeComponent } from './settings/password-change/password-change.component';
import { SystemMessagesComponent } from '../system-messages/system-messages.component';

@NgModule({
  imports: [
    AppRoutingModule,
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    HomeComponent,
    HeaderComponent,
    SideMenuComponent,
    SettingsComponent,
    GeneralComponent,
    PasswordChangeComponent,
  ],
  exports: [
    AppRoutingModule,
    HeaderComponent,
    SideMenuComponent
  ],
  entryComponents: [
    SystemMessagesComponent
  ],
  providers: [
    SettingsService
  ]
})
export class CoreModule { }
