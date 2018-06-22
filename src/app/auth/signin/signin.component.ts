import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SystemMessagesService } from 'app/system-messages/system-messages.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  sinForm: FormGroup;
  @ViewChild('f') f;
  constructor(
    private authService: AuthService,
    private router: Router,
    private SystemMsgService: SystemMessagesService) { }

  ngOnInit() {

    this.sinForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    })
  }

  onSubmit() {

    const email = this.sinForm.value.email;
    const password = this.sinForm.value.password;

    const user = new User(email, password);

    this.authService.signin(user).subscribe((data: any) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('name', data.user.firstname);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('status', data.user.status);
      this.authService.usernameExtracted.next(data.user.firstname);
      this.router.navigate(['/']);
    },
      (error) => {
        this.SystemMsgService.showMessage({ error: true, msg: 'Wrong email or password.' })
        this.f.resetForm();
      });


  }
}

