import { Location } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SystemMessagesService } from 'app/system-messages/system-messages.service';
import 'hammerjs';
import { AppConfigService, configServiceFactory } from './app-config.service';
import { AppMaterialModule } from './app-material/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CanActivateIfLoggedInGuard } from './auth/authGuards/can-activate-if-logged-in-guard.service';
import { TokenInterceptor } from './auth/token.interceptor';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { SocketService } from './chat/socket.service';
import { CoreModule } from './core/core.module';
import { HeaderService } from './core/header/header.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { SystemMessagesComponent } from './system-messages/system-messages.component';
import { TeachersComponent } from './teachers/teachers.component';
import { TeachersService } from './teachers/teachers.service';

@NgModule({
  declarations: [
    AppComponent,
    TeachersComponent,
    SystemMessagesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppMaterialModule,
    CoreModule,
    SharedModule,
    AuthModule,
    ChatModule,
    AppRoutingModule,
    DashboardModule,
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      deps: [AppConfigService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    HeaderService,
    SystemMessagesService,
    TeachersService,
    AuthService,
    ChatService,
    SocketService,
    Location,
    CanActivateIfLoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
