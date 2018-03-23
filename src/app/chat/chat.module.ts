import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatWindowFactoryComponent } from './chat-window-factory/chat-window-factory.component';
import { AppMaterialModule } from '../app-material/app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomCreationDialogComponent } from './room-creation-dialog/room-creation-dialog.component';
import { AddPersonDialogComponent } from './add-person-dialog/add-person-dialog.component';
import { CallDialogComponent } from './call-dialog/call-dialog.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ChatComponent,
    ChatWindowComponent,
    ChatWindowFactoryComponent,
    RoomCreationDialogComponent,
    AddPersonDialogComponent,
    CallDialogComponent,

  ],
  entryComponents: [
    RoomCreationDialogComponent,
    AddPersonDialogComponent,
    CallDialogComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ChatRoutingModule,
    SharedModule
  ],
  exports: [
  ]
})
export class ChatModule { }
