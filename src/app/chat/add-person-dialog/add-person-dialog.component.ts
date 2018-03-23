import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ChatService } from '../chat.service';

@Component({
  selector: 'app-add-person-dialog',
  templateUrl: './add-person-dialog.component.html',
  styleUrls: ['./add-person-dialog.component.css']
})
export class AddPersonDialogComponent implements OnInit {

  users = [];
  room = null;

  constructor(
    private chatService: ChatService,
    public dialogRef: MatDialogRef<AddPersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.room = this.data.room;
    this.users = this.chatService.onlineUsers.filter((ele, i, arr) => {

      if (!this.room.users.find(x => x === ele._id)) {
        return ele;
      }
    });

  }

  onCancelClick() {
    this.dialogRef.close();
  }
  onAddClick() {
    this.dialogRef.close(this.data);
  }
}
