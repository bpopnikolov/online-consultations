import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './app-material/app-material.module';
import { CoreModule } from './core/core.module';
import { HeaderService } from './core/header/header.service';
import { TeachersComponent } from './teachers/teachers.component';
import { TeachersService } from './teachers/teachers.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { ChatComponent } from './chat/chat.component';
import { ChatService } from './chat/chat.service';
import { SocketService } from './chat/socket.service';
import { ChatWindowFactoryComponent } from './chat/chat-window-factory/chat-window-factory.component';
import { ChatWindowComponent } from './chat/chat-window/chat-window.component';
import { ChatModule } from './chat/chat.module';
import { WebrtcService } from './webrtc.service';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { Location } from '@angular/common';
import { CanActivateIfLoggedInGuard } from './auth/authGuards/can-activate-if-logged-in-guard.service';
import { SharedModule } from './shared/shared.module';
import { SystemMessagesComponent } from './system-messages/system-messages.component';
import { SystemMessagesService } from 'app/system-messages/system-messages.service';




@NgModule({
  declarations: [
    AppComponent,
    TeachersComponent,
    VideoChatComponent,
    SystemMessagesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppMaterialModule,
    CoreModule,
    SharedModule,
    AuthModule,
    ChatModule,
    AppRoutingModule,
  ],
  providers: [
    HeaderService,
    SystemMessagesService,
    TeachersService,
    AuthService,
    ChatService,
    SocketService,
    WebrtcService,
    Location,
    CanActivateIfLoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
