import { Component, OnInit } from '@angular/core';
import { Teacher } from './teacher.model';
import { TeachersService } from './teachers.service';


@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

  teachers: Teacher[] = [];

  constructor(private teachersService: TeachersService) { }

  ngOnInit() {
    this.teachersService.getTeachers().subscribe((teacher: Teacher[]) => {
      this.teachers = teacher;
    });
  }

}
