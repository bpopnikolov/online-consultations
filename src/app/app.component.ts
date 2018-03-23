import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderService } from './core/header/header.service';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './auth/auth.service';
import { ChatComponent } from './chat/chat.component';
import { Router } from '@angular/router';
import { SocketService } from './chat/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  userId: string = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';
  @ViewChild('sidenav') sidenav: MatSidenav
  subscriptio: Subscription;
  showSideMenu: Boolean;

  constructor(
    private hs: HeaderService,
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private socketService: SocketService) {

    this.router.events.subscribe((val) => {
      if (this.location.path().toString().includes('/call') ) {
        this.showSideMenu = false;
      } else {
        this.showSideMenu = true;
      }
    });
  }

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.subscriptio = this.hs.menuClicked.subscribe(() => {
      this.sidenav.toggle();
    });
  }

  onMoreButtonClick() {
    this.hs.onMenuButtonClick();
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscriptio.unsubscribe();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  onLogout() {
    this.authService.logout().subscribe((data) => {
      console.log(data.message + ' ' + data.status);
      localStorage.clear();
      this.socketService.singOut();
      this.router.navigate(['/']);
    })
  }
}
