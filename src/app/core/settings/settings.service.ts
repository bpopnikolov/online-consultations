import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class SettingsService {

  private token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
  userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';
  constructor(private http: HttpClient) { }

  getProfile() {
    const body = JSON.stringify({
      userId: this.userId
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post('./user/getUser', body, { headers: headers })
  }

  setProfile(email, profileInfo) {

    const body = JSON.stringify({
      userId: this.userId,
      email: email,
      profileInfo: profileInfo
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post('./user/setUserProfile', body, { headers: headers })
  }

  changePassword(currentPassword, newPassword) {
    const body = JSON.stringify({
      userId: this.userId,
      currentPassword: currentPassword,
      newPassword: newPassword
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post('./user/changeUserPassword', body, { headers: headers })
  }
}
