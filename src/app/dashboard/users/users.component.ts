import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SystemMessagesService } from '../../system-messages/system-messages.service';
import { UsersDashboardService } from './shared/users-dashboard.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {

  displayedColumns = ['position', 'firstname', 'lastname', 'role'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectChanged = new EventEmitter();

  constructor(
    private usersService: UsersDashboardService,
    public systemMsgService: SystemMessagesService) { }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    this.usersService.getUsers().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data)
    })

    this.selectChanged.subscribe((data) => {
      data.element.role = data.event.value;
      this.usersService.updateUserRole(data.element).subscribe((response) => {
        this.systemMsgService.showMessage(response)
      })
    })
  }


  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}

