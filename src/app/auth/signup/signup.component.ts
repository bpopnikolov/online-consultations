import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { SystemMessagesService } from 'app/system-messages/system-messages.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('f') supForm: NgForm;
  @ViewChild('role') public role;

  roles = [
    { value: 'student', viewValue: 'Student' },
    { value: 'teacher', viewValue: 'Teacher' },
  ];

  constructor(private authService: AuthService, private router: Router, private SystemMsgService: SystemMessagesService) { }

  ngOnInit() {

  }

  onSubmit() {
    const firstname: string = this.supForm.value.firstname;
    const lastname: string = this.supForm.value.lastname;
    const email: string = this.supForm.value.email;
    const password: string = this.supForm.value.password;
    const role: string = this.supForm.value.role;


    const user: User = new User(email, password, firstname, lastname, role);


    this.authService.signup(user).subscribe((result) => {
      localStorage.setItem('token', result.token);
      localStorage.setItem('userId', result.user._id);
      localStorage.setItem('name', result.user.firstname);
      localStorage.setItem('role', result.user.role);
      localStorage.setItem('status', result.user.status);
      this.authService.usernameExtracted.next(result.user.firstname);
      this.supForm.resetForm();
      this.router.navigate(['/']);
    }, (error) => {
      this.SystemMsgService.showMessage(error);
      this.supForm.resetForm();
    });

  }
}
