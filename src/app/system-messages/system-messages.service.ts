import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SystemMessagesComponent } from 'app/system-messages/system-messages.component';

@Injectable()
export class SystemMessagesService {

  constructor(private snackBar: MatSnackBar) { }

  showMessage(response) {

    const snackBackground = response.error ? 'error-snackbar' : 'success-snackbar';

    this.snackBar.openFromComponent(SystemMessagesComponent, {
      duration: 3000,
      data: response.msg,
      panelClass: snackBackground
    });
  }

}
