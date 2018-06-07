import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SystemMessagesService } from 'app/system-messages/system-messages.service';
import { Subscription } from 'rxjs/Subscription';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit, OnDestroy {

  generalForm: FormGroup;
  role = localStorage.getItem('role') ? localStorage.getItem('role') : '';
  getProfileSubscription: Subscription;
  phonePattern = new RegExp('\d{4}-\d{3}-\d{4}$');

  constructor(private settingsService: SettingsService, private systemMsgService: SystemMessagesService) { }

  ngOnInit() {
    this.generalForm = new FormGroup({
      name: new FormControl({ value: '', disabled: true }, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$')]),
      facultyNumber: new FormControl(null),
      consultationsTime: new FormControl(null)
    });

    this.getProfileSubscription = this.settingsService.getProfile().subscribe((data: any) => {
      this.generalForm.patchValue({
        name: data.firstname + ' ' + data.lastname,
        email: data.email,
        phone: data.profileInfo.phone,
        facultyNumber: data.profileInfo.facultyNumber,
        consultationsTime: data.profileInfo.consultationsTime
      });

    });


  }

  onSubmit() {

    const email = this.generalForm.value.email;
    const phone = this.generalForm.value.phone ? this.generalForm.value.phone : '';
    const facultyNumber = this.generalForm.value.facultyNumber ? this.generalForm.value.facultyNumber : '';
    const consultTime = this.generalForm.value.consultationsTime ? this.generalForm.value.phone : '';

    const profileInfo = {
      phone: phone,
      facultyNumber: facultyNumber,
      consultationsTime: consultTime
    };

    this.settingsService.setProfile(email, profileInfo).subscribe((response) => {
      console.log(response);
      this.systemMsgService.showMessage(response);
    });
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.getProfileSubscription.unsubscribe();
  }

}
