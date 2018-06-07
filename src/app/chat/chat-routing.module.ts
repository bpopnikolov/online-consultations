import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { ChatComponent } from './chat.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { CanActivateIfLoggedInGuard } from '../auth/authGuards/can-activate-if-logged-in-guard.service';



const routes: Routes = [
  {
    path: '', component: ChatComponent, canActivate: [CanActivateIfLoggedInGuard], children: [
      { path: ':id', component: ChatWindowComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
