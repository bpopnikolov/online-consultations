import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  name: string = localStorage.getItem('name') ? localStorage.getItem('name') : '';
  subscribtion: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.subscribtion = this.authService.usernameExtracted.subscribe((name) => {
      this.name = name
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}
