
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { ChatService } from '../chat.service';
import { Message } from '../models/message.model';
import { SelectedUser } from '../models/selectedUser.model';
import { SocketService } from '../socket.service';



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
  subs: Subscription[] = [];


  constructor(
    private socketService: SocketService,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.chatService.selectedRoom) {
      const sub1 = this.chatService.getMessages(this.chatService.userId, this.chatService.selectedRoom._id).subscribe((data: any) => {
        this.messages = data.messages;

      });
      this.subs.push(sub1);
    }


    this.roomSubscription = this.chatService.onRoomSelected.subscribe((user) => {
      const sub2 = this.chatService.getMessages(this.chatService.userId, this.chatService.selectedRoom._id).subscribe((data: any) => {
        this.messages = data.messages;
      });
      this.subs.push(sub2);
    });

    const sub3 = this.socketService.receiveMessages().subscribe((data) => {

      if ((this.chatService.selectedRoom._id === data.to) && (data.from !== this.chatService.userId)) {
        this.messages.push(data);
        this.socketService.markNotificationAsSeen(this.chatService.selectedRoom, this.chatService.userId);
        this.scrollToBottom();
      }
    });
    this.subs.push(sub3);
  }

  ngAfterViewChecked() {
    // Called after every check of the component's view. Applies to components only.
    // Add 'implements AfterViewChecked' to the class.
    if (this.messages.length !== this.lenght) {
      this.scrollToBottom();
      this.lenght = this.messages.length;
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
    }
    const user = this.chatService.infoUsers.find(x => x._id === message.from);

    return `${user.firstname} ${user.lastname} ${moment(message.createdAt).calendar()}`;
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
    this.subs.forEach((s) => s.unsubscribe());
  }
}
