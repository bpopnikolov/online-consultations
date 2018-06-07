import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { User } from './user.model';


export const tokenGetter = () => {
  return localStorage.getItem('token');
}

@Injectable()
export class AuthService {

  usernameExtracted = new Subject<string>();

  constructor(private http: HttpClient) { }

  signup(user: User) {
    const body = JSON.stringify(user);
    const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post('./user/signup', body, { headers: myHeaders })
  }

  signin(user: User) {
    const body = JSON.stringify(user);
    const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post('./user/signin', body, { headers: myHeaders });
  }


  logout() {
    const body = JSON.stringify({ '_id': localStorage.getItem('userId') });

    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post('./user/signout', body, { headers: myHeaders })
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  isAdmin() {
    return localStorage.getItem('role') === 'admin' ? true : false;
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
