import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { Subscription } from 'rxjs/Subscription';
import { SystemMessagesService } from 'app/system-messages/system-messages.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  changePassForm: FormGroup;
  changePasswordSub: Subscription;
  @ViewChild('f') f;

  constructor(private settingsService: SettingsService, private systemMsgService: SystemMessagesService) { }

  ngOnInit() {
    this.changePassForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
    });
    console.log(this.changePassForm);
  }

  onSubmit() {
    const currentPassword = this.changePassForm.value.currentPassword;
    const newPassword = this.changePassForm.value.newPassword;

    this.settingsService.changePassword(currentPassword, newPassword).subscribe((response) => {
      this.systemMsgService.showMessage(response);
      this.f.resetForm();
    });

  }
}
