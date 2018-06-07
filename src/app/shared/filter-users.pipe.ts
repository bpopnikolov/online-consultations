import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

  transform(users: any[], status: string): any {
    if (!users) {
      return [];
    }

    return users.filter((user) => user.status === status);
  }

}
