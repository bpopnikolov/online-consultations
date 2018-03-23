import { Component, OnInit } from '@angular/core';

import { TeachersService } from './teachers.service';
import { Teacher } from './teacher.model';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

  teachers: Teacher[] = [];

  constructor(private teachersService: TeachersService) { }

  ngOnInit() {
    this.teachers = this.teachersService.getTeachers();
  }

}
