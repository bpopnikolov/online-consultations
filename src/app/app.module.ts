import { Location } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SystemMessagesService } from 'app/system-messages/system-messages.service';
import 'hammerjs';
import { AppMaterialModule } from './app-material/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CanActivateIfLoggedInGuard } from './auth/authGuards/can-activate-if-logged-in-guard.service';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { SocketService } from './chat/socket.service';
import { CoreModule } from './core/core.module';
import { HeaderService } from './core/header/header.service';
import { SharedModule } from './shared/shared.module';
import { SystemMessagesComponent } from './system-messages/system-messages.component';
import { TeachersComponent } from './teachers/teachers.component';
import { TeachersService } from './teachers/teachers.service';
import { WebrtcService } from './webrtc.service';







@NgModule({
  declarations: [
    AppComponent,
    TeachersComponent,
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
