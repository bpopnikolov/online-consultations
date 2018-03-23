import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HeaderService {

menuClicked = new Subject();

  constructor() { }

  onMenuButtonClick() {
    this.menuClicked.next();
  }
}
