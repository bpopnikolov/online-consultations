import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth/auth.service';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  name: string = localStorage.getItem('name') ? localStorage.getItem('name') : '';
  subscribtion: Subscription

  constructor(private hs: HeaderService, private authService: AuthService) { }

  ngOnInit() {
    this.subscribtion = this.authService.usernameExtracted.subscribe((name) => {
      this.name = name
    });
  }

  onMenuClick() {
    this.hs.onMenuButtonClick();
  }

  onLogout() {
    this.authService.logout().subscribe((data: any) => {
      console.log(data.message);
      localStorage.clear();
    })
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscribtion.unsubscribe();
  }
}
