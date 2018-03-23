import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';


@Component({
  selector: 'app-system-messages',
  templateUrl: './system-messages.component.html',
  styleUrls: ['./system-messages.component.css']
})
export class SystemMessagesComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<SystemMessagesComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) {

   }

  ngOnInit() {
    console.log(this.snackBarRef);
  }

}
