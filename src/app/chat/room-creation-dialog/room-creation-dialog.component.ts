import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-room-creation-dialog',
  templateUrl: './room-creation-dialog.component.html',
  styleUrls: ['./room-creation-dialog.component.css']
})
export class RoomCreationDialogComponent implements OnInit {

  users = [];


  constructor(
    private chatService: ChatService,
    public dialogRef: MatDialogRef<RoomCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.users = this.chatService.users;
  }

  onCancelClick() {
    this.dialogRef.close();
  }
  onCreateClick() {
    if (this.data.roomName) {
      this.dialogRef.close(this.data);
    }
  }
}
