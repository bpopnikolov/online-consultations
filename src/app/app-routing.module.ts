import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateIfLoggedInGuard } from 'app/auth/authGuards/can-activate-if-logged-in-guard.service';
import { GeneralComponent } from 'app/core/settings/general/general.component';
import { PasswordChangeComponent } from 'app/core/settings/password-change/password-change.component';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './core/home/home.component';
import { SettingsComponent } from './core/settings/settings.component';
import { TeachersComponent } from './teachers/teachers.component';




const routes: Routes = [

  { path: '', component: HomeComponent },
  {
    path: 'chat', component: ChatComponent,
    loadChildren: './chat/chat.module#ChatModule',
    canActivate: [CanActivateIfLoggedInGuard]
  },
  { path: 'teachers', component: TeachersComponent, canActivate: [CanActivateIfLoggedInGuard] },
  {
    path: 'call/:id/:initiator',
    loadChildren: './video-chat/video-chat.module#VideoChatModule',
    canActivate: [CanActivateIfLoggedInGuard]
  },
  {
    path: 'admin',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
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
