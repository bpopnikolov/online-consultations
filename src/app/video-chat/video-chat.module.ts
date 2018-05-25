import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from '../app-material/app-material.module';
import { VideoChatRoutingModule } from './video-chat-routing.module';
import { VideoChatComponent } from './video-chat.component';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    VideoChatRoutingModule
  ],
  declarations: [VideoChatComponent]
})
export class VideoChatModule { }
