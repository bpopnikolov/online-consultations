import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class UsersDashboardService {


  constructor(private http: HttpClient) {

  }

  getUsers() {
    return this.http.get('/user');
  }

  updateUserRole(user) {
    const body = user;
    return this.http.post('user/updateUserRole', user);
  }
}
