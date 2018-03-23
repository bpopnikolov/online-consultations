import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderService } from './header.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';

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
    this.authService.logout().subscribe((data) => {
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
