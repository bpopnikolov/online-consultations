import { Injectable } from '@angular/core';
import { Teacher } from './teacher.model';

@Injectable()
export class TeachersService {

  teachers: Teacher[] = [
    new Teacher("Borislav", "Popnikolov",
      "https://scontent.fath4-1.fna.fbcdn.net/v/t1.0-9/16681980_1597887090226024_2843095101033010437_n.jpg?oh=6c5a9e0fa10c795713a7eff596fd2b84&oe=59EDA5FE", "Bachelor", "Informatic", "123123123", "1:30pm - 4:30pm"),
    new Teacher("Sergio", "Sergiofulis", "https://scontent.fath4-1.fna.fbcdn.net/v/t1.0-9/14457304_1439798596047459_6839434281550387549_n.jpg?oh=b2067a52d685b8490fe605549bfeeda0&oe=5A2869CF", "Bachelor", "Informatic", "123123123", "1:30pm - 4:30pm"),
    new Teacher("Elina", "Lekka", "https://scontent.fath4-1.fna.fbcdn.net/v/t1.0-9/20265015_2338903133001863_4618917275149888684_n.jpg?oh=3e551a046b4a4833903d6027ab320f6a&oe=59EADCD4", "Bachelor", "Informatic", "123123123", "1:30pm - 4:30pm"),
    new Teacher("Theodor", "Shkembi", "https://scontent.fath4-1.fna.fbcdn.net/v/t1.0-9/14079650_10208479354633680_9053275398465766119_n.jpg?oh=b7d0f10801656ffbba7d4d7458c45df4&oe=5A390C54", "Bachelor", "Informatic", "123123123", "1:30pm - 4:30pm"),
    new Teacher("Theodor", "Shkembi", "https://scontent.fath4-1.fna.fbcdn.net/v/t1.0-9/16681980_1597887090226024_2843095101033010437_n.jpg?oh=6c5a9e0fa10c795713a7eff596fd2b84&oe=59EDA5FE", "Bachelor", "Informatic", "123123123", "1:30pm - 4:30pm"),
    new Teacher("Theodor", "Shkembi", "https://scontent.fath4-1.fna.fbcdn.net/v/t1.0-9/16681980_1597887090226024_2843095101033010437_n.jpg?oh=6c5a9e0fa10c795713a7eff596fd2b84&oe=59EDA5FE", "Bachelor", "Informatic", "123123123", "1:30pm - 4:30pm"),

  ];

  constructor() { }

  getTeachers() {
    return this.teachers;
  }
}
