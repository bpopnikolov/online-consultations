import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { User } from './user.model';

@Injectable()
export class AuthService {

  usernameExtracted = new Subject<string>();

  constructor(private http: Http) { }

  signup(user: User) {
    const body = JSON.stringify(user);
    const myHeaders = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post('http://localhost:3000/user/signup', body, { headers: myHeaders }).map((response: Response) => {
      return response.json();
    }).catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }

  signin(user: User) {
    const body = JSON.stringify(user);
    const myHeaders = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post('http://localhost:3000/user/signin', body, { headers: myHeaders }).map((response: Response) => {
      return response.json();
    }).catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }


  logout() {
    const body = JSON.stringify({ '_id': localStorage.getItem('userId') });
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';

    const myHeaders = new Headers({
      'Content-Type': 'application/json', 'Authorization' : token  });

    return this.http.post('http://localhost:3000/user/signout', body, { headers: myHeaders }).map((response: Response) => {
      return response.json();
    }).catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }


}
