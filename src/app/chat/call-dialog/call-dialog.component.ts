import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { ChatService } from '../chat.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-call-dialog',
  templateUrl: './call-dialog.component.html',
  styleUrls: ['./call-dialog.component.css']
})
export class CallDialogComponent implements OnInit, OnDestroy {

  caller;
  timetSub: Subscription
  secondsDisplay;
  minutesDisplay;
  hoursDisplay;
  timeToAnswer = 10;
  answerCall: Boolean;

  constructor(
    private chatService: ChatService,
    public dialogRef: MatDialogRef<CallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.caller = this.data.user;
    const timer = Observable.timer(0, 1000);
    this.timetSub = timer.subscribe((ticks) => {

      this.secondsDisplay = this.getSeconds(ticks);
      this.minutesDisplay = this.getMinutes(ticks);
      this.hoursDisplay = this.getHours(ticks);

      this.timeToAnswer = this.timeToAnswer - 1;

      if ((this.timeToAnswer <= 0) && typeof this.answerCall === 'undefined') {
        this.data.answerCall = false;
        this.dialogRef.close(this.data);
      }

    });

  }

  onAnswerCall() {
    this.answerCall = true;
    this.data.answerCall = this.answerCall;
    this.dialogRef.close(this.data);

  }
  onRejectCall() {
    this.answerCall = false;
    this.data.answerCall = this.answerCall;
    this.dialogRef.close(this.data);

  }

  getSeconds(ticks: number) {
    return this.pad(ticks % 60);
  }

  getMinutes(ticks: number) {
    return this.pad((Math.floor(ticks / 60)) % 60);
  }

  getHours(ticks: number) {
    return this.pad(Math.floor((ticks / 60) / 60));
  }

  pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }
  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.timetSub.unsubscribe();
  }

}
