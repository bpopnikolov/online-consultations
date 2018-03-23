import { Component, OnInit, Inject } from '@angular/core';
import { ChatService } from '../chat.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

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
    this.users = this.chatService.onlineUsers;
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
