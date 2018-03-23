import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header/header.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  sideButtons = [{
    icon: 'chat',
    action: '/chat',
    tooltip: 'Chat'
  }, {
    icon: 'people',
    action: '/teachers',
    tooltip: 'Teachers'
  }];

  constructor(private hs: HeaderService) { }

  ngOnInit() {
  }

  onMoreButtonClick() {
    this.hs.onMenuButtonClick();
  }

}
