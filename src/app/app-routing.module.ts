import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { TeachersComponent } from './teachers/teachers.component';
import { ChatComponent } from './chat/chat.component';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { SettingsComponent } from './core/settings/settings.component';
import { CanActivateIfLoggedInGuard } from 'app/auth/authGuards/can-activate-if-logged-in-guard.service';
import { GeneralComponent } from 'app/core/settings/general/general.component';
import { PasswordChangeComponent } from 'app/core/settings/password-change/password-change.component';



const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'call/:id/:initiator', loadChildren: './video-chat/video-chat.module#VideoChatModule' },
  {
    path: 'settings', component: SettingsComponent, canActivate: [CanActivateIfLoggedInGuard], children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: GeneralComponent },
      { path: 'changepassword', component: PasswordChangeComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
