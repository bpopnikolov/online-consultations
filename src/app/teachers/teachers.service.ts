import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Teacher } from './teacher.model';

@Injectable()
export class TeachersService {

  constructor(private http: HttpClient) { }

  public getTeachers(): Observable<Array<Teacher>> {
    return this.http.get<Array<Teacher>>('/user')
      .map((teachers) => {
        return teachers.filter((teacher: Teacher) => teacher.role === 'teacher');
      });
  }
}
