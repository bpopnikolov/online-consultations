
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';

import { SocketService } from '../socket.service';
import { ChatService } from '../chat.service';
import { SelectedUser } from '../models/selectedUser.model';
import { Message } from '../models/message.model';
import * as moment from 'moment';


@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  @ViewChild('f') form: NgForm;
  @ViewChild('lala') list: ElementRef;
  selectedUser: SelectedUser = this.chatService.selectedUser;
  messages = [];
  roomSubscription: Subscription;
  lenght = this.messages.length;


  constructor(
    private socketService: SocketService,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.chatService.selectedRoom) {
      this.chatService.getMessages(this.chatService.userId, this.chatService.selectedRoom._id).subscribe((data) => {
        console.log('room msgs');
        console.log(data);
        this.messages = data.messages;

      });
    }


    this.roomSubscription = this.chatService.onRoomSelected.subscribe((user) => {
      this.chatService.getMessages(this.chatService.userId, this.chatService.selectedRoom._id).subscribe((data) => {
        this.messages = data.messages;
      });
    });

    this.socketService.receiveMessages().subscribe((data) => {

      if ((this.chatService.selectedRoom._id === data.to) && (data.from !== this.chatService.userId)) {
        this.messages.push(data);
        this.socketService.markNotificationAsSeen(this.chatService.selectedRoom, this.chatService.userId);
        this.scrollToBottom();
      }
    });
  }

  ngAfterViewChecked() {
    // Called after every check of the component's view. Applies to components only.
    // Add 'implements AfterViewChecked' to the class.
    if (this.messages.length !== this.lenght) {
      this.scrollToBottom();
      this.lenght = this.messages.length;
      console.log('SCROLL FIRED!');
    }
  }
  ngAfterViewInit() {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
  }

  onSubmit(event) {
    if (event.keyCode === 13) {
      if (this.form.value.messageInput === null) {
        this.form.reset();
      } else if (!this.form.value.messageInput.trim()) {
        this.form.reset();
      } else {
        const content = this.form.value.messageInput;
        const from = this.chatService.userId;
        const to = this.chatService.selectedRoom._id
        const msg = new Message(content, from, to);
        this.messages.push(msg);
        this.scrollToBottom();
        this.socketService.sendMessage(msg);
        this.form.reset();
      }
    }
  }

  alignMessageContainer(message) {

    if (message.from === this.chatService.userId) {
      return 'message-right'
    } else {
      return 'message-left'
    }
  }

  alignMessage(message) {

    if (message.from === this.chatService.userId) {
      return 'msg-text-right'
    } else {
      return 'msg-text-left'
    }

  }

  setMsgTooltip(message) {
    if (message.from === this.chatService.userId) {
      return 'You ' + moment(message.createdAt).calendar();
    } else {

      return this.chatService.selectedRoom.users.find(x => x === message.from) + ' ' + moment(message.createdAt).calendar();

    }
  }

  setMsgTooltipPosition(message) {

    if (message.from === this.chatService.userId) {
      return 'left'
    } else {
      return 'right'
    }
  }
  scrollToBottom(): void {
    try {
      this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight + this.list.nativeElement.clientHeight;
    } catch (err) { }
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.roomSubscription.unsubscribe();
  }
}
