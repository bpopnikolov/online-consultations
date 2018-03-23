import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class SettingsService {

  private token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
  userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';
  constructor(private http: Http) { }

  getProfile() {
    const body = JSON.stringify({
      userId: this.userId
    });
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

    return this.http.post('http://localhost:3000/user/getUser', body, { headers: headers }).map((response: Response) => {
      return response.json();
    }).catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }

  setProfile(email, profileInfo) {

    const body = JSON.stringify({
      userId: this.userId,
      email: email,
      profileInfo: profileInfo
    });
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

    return this.http.post('http://localhost:3000/user/setUserProfile', body, { headers: headers }).map((response: Response) => {
      return response.json();
    }).catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }

  changePassword(currentPassword, newPassword) {
    const body = JSON.stringify({
      userId: this.userId,
      currentPassword: currentPassword,
      newPassword: newPassword
    });
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });

    return this.http.post('http://localhost:3000/user/changeUserPassword', body, { headers: headers }).map((response: Response) => {
      return response.json();
    }).catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }
}
