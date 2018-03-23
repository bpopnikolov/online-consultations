import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';

import { ChatService } from './chat.service';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { SocketService } from './socket.service';
import { SelectedUser } from './models/selectedUser.model';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';
import { RoomCreationDialogComponent } from './room-creation-dialog/room-creation-dialog.component';
import { Room } from './models/room.model';
import { AddPersonDialogComponent } from './add-person-dialog/add-person-dialog.component';
import { CallDialogComponent } from './call-dialog/call-dialog.component';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  roomToCreate = {
    roomName: null,
    creator: this.chatService.userId,
    roomUsers: []
  };

  selectedItem;
  userId = null;
  onlineUsers = [];
  publicRooms = [];
  privateRooms = [];

  chatListSubscription: Subscription;
  notificationsSubscribtion: Subscription;
  roomListSubscribtion: Subscription;
  privateRoomCreationSubscribtion: Subscription;
  notificationsSeenSubscribtion: Subscription;
  receiveCallSubscription: Subscription;
  roomCallSubscription: Subscription;
  callLeaveSubscription: Subscription;


  componentData: any;

  constructor(
    private chatService: ChatService,
    private socketService: SocketService,
    private injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  createComponent() {
    this.componentData = {
      component: ChatWindowComponent,
      inputs: {
        someData: 'FACTORY WORKS!'
      }
    }
  }

  ngOnInit() {

    this.userId = this.chatService.userId;
    this.socketService.connectSocket(this.userId);

    this.privateRoomCreationSubscribtion = this.socketService.privateRoomSelected().subscribe((data) => {
      console.log(data);
      this.chatService.setSelectedRoom(data.room);
      this.socketService.markNotificationAsSeen(data.room, this.userId);
      if (!this.chatService.privateRooms.find(x => x._id === data.room._id)) {
        this.chatService.privateRooms.push(data.room);
        this.socketService.joinRoom(data.room);
      }
      console.log('private room selected!');
      console.log(this.chatService.privateRooms);
      console.log(this.chatService.selectedRoom);

    });

    this.roomListSubscribtion = this.socketService.getRoomList(this.userId).subscribe((response) => {
      console.log(response);
      if (!response.error) {
        if (response.newRoom) {
          this.chatService.publicRooms.push(response.newRoom);
          this.socketService.joinRoom(response.newRoom);
        } else if (response.someoneLeftRoom) {
          this.chatService.publicRooms.filter((ele, i, arr) => {
            if (ele._id === response.room._id) {
              console.log('room users before:');
              console.log(arr[i]);
              arr[i] = response.room;
              console.log('after');
              console.log(arr[i]);
            }
          });
        } else if (response.addedToRoom) {

          this.chatService.publicRooms.push(response.room);
          this.socketService.joinRoom(response.room);

        } else if (response.personJoined) {

          this.chatService.publicRooms.filter((ele, i, arr) => {

            if (ele._id === response.room._id) {
              arr[i] = response.room;
            }
          });
        } else {
          this.chatService.publicRooms = response.roomList.filter((room) => {
            this.socketService.joinRoom(room);
            console.log('joined room');
            console.log(room);
            if (room.type !== 'system') {
              return room;
            } else {
              this.chatService.privateRooms.push(room);
            }
          });
        }
      } else {
        console.log(`Couldn't get room list.`);
      }
      this.publicRooms = this.chatService.publicRooms;
      this.privateRooms = this.chatService.privateRooms;
    });


    this.notificationsSubscribtion = this.socketService.getNotifcations(this.userId).subscribe((result) => {
      if (!result.error) {

        if (result.initialNotifications) {
          this.chatService.notifications = result.notifications;
          console.log(this.chatService.notifications);

        } else if (result.notifications.notSeenBy.includes(this.userId)) {
          this.chatService.notifications.push(result.notifications);
          console.log('recived new notification!');
          console.log(result);
        }
      }
    });

    this.notificationsSeenSubscribtion = this.socketService.notificationSeenResponse().subscribe((response) => {
      this.chatService.notifications.filter((item, i, arr) => {
        if (item._id === response._id && response.notSeenBy.length === 0) {
          this.chatService.notifications.splice(i, 1);
        } else if (item._id === response._id) {
          this.chatService.notifications[i] = response;
        }
      })
    })

    this.chatListSubscription = this.socketService.getChatList(this.userId).subscribe((response) => {
      console.log(response);
      if (!response.error) {

        if (response.singleUser) {


          if (this.chatService.onlineUsers.length > 0) {
            this.chatService.onlineUsers = this.chatService.onlineUsers.filter((user) => {
              return user._id !== response.chatList._id;
            });
          }
          this.chatService.onlineUsers.push(response.chatList);


        } else if (response.userDisconnected) {
          this.chatService.onlineUsers = this.chatService.onlineUsers.filter((user) => {
            return user.socketId !== response.socketId;
          });
        } else {
          this.chatService.onlineUsers = response.chatList.filter((user) => {
            return user._id !== this.userId;
          });
        }

      } else {
        console.log('chat failed!');
      }
      this.onlineUsers = this.chatService.onlineUsers;
      console.log(this.onlineUsers);
    });

    // Call Logic

    this.receiveCallSubscription = this.socketService.onReceiveCall().subscribe((response) => {
      console.log('from observable');
      console.log(response);

      if (response.callFrom.user !== this.userId) {
        this.callDialog(response.callFrom.room, response.callFrom.user);
      }

    });

    this.roomCallSubscription = this.socketService.onRoomCall().subscribe((room) => {
      console.log(room);
      let arrayToFilter;

      if (room.type === 'system') {
        arrayToFilter = this.chatService.privateRooms;
      } else {
        arrayToFilter = this.chatService.publicRooms;
      }

      arrayToFilter.filter((currentRoom, index, arr) => {
        if (currentRoom._id === room._id) {
          arr[index] = room;
          console.log('room in call updated');
        }
      });
    });

    this.callLeaveSubscription = this.socketService.onCallLeave().subscribe((room) => {
      console.log('user left call');
      console.log(room);
      let arrayToFilter;

      if (room.type === 'system') {
        arrayToFilter = this.chatService.privateRooms;
      } else {
        arrayToFilter = this.chatService.publicRooms;
      }

      arrayToFilter.filter((currentRoom, index, arr) => {
        if (currentRoom._id === room._id) {
          arr[index] = room;
          console.log('room in call updated');
        }
      });
    })
  }

  onSelectRoom(room, index) {
    this.selectedItem = index + this.onlineUsers.length;
    this.chatService.setSelectedRoom(room);
    this.socketService.markNotificationAsSeen(room, this.userId);
  }

  showPublicRoomUsers(room) {

    let user = '';
    room.users.forEach(element => {
      user += element + `\n`;
    });
    return user;
  }

  onLeaveRoomClick(room) {
    this.chatService.publicRooms.filter((ele, i, arr) => {
      if (ele._id === room._id) {
        arr.splice(i, 1);
      }
    });
    this.socketService.leaveChatRoom(room._id, this.userId);
    console.log(room);
  }

  onSelectUser(userSelected, index) {
    this.selectedItem = index;
    const selectedUser = new SelectedUser(userSelected._id, userSelected.socketId, userSelected.firstname + ' ' + userSelected.lastname);
    this.chatService.setSelectedUser(selectedUser);

    this.socketService.createPrivateRoom(this.userId, userSelected);
  }

  privateRoomNotifications(selectedUser) {
    let visible = false;

    const room = this.chatService.privateRooms.find(x => x.users.includes(selectedUser._id, this.userId));

    if (this.chatService.notifications.find(x => x.to === room._id)) {
      visible = true;
    }

    return visible;
  }

  publicRoomNotifications(publicRoom) {
    let visible = false;

    if (this.chatService.notifications.find(x => x.to === publicRoom._id)) {
      visible = true;
    }
    return visible;
  }

  checkIfSelectedUser() {
    return this.chatService.selectedRoom ? true : false;
  }

  openNewRoomDialog() {
    this.roomToCreate.roomName = null;
    this.roomToCreate.roomUsers = [];
    const dialogRef = this.dialog.open(RoomCreationDialogComponent, {
      width: '350px',
      data: this.roomToCreate
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog was closed');

      if (result) {
        this.socketService.createRoom(
          result.roomName,
          result.creator,
          result.roomUsers);
      }
    });
  }

  openAddPersonDialog(room) {
    const dialogRef = this.dialog.open(AddPersonDialogComponent, {
      width: '350px',
      data: {
        room: room,
        personsToAdd: []
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog was closed');

      if (result) {
        this.socketService.addPersonsToRoom(result);
      }
    });
  }

  callDialog(room, user) {
    const dialogRef = this.dialog.open(CallDialogComponent, {
      width: '350px',
      data: {
        room: room,
        user: user,
        answerCall: null
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('call dialog was closed');

      if (result) {
        if (result.answerCall) {
          this.socketService.answerCall(this.userId, result.room);
          console.log('joining');
          window.open('http://localhost:3000/call/' + result.room + '/' + 'false',
            'videoChat',
            `resizable=yes,
           toolbar=no,
           location=no,
           scrollbars=no,
           menubar=no,
           status=no,
           height=720,
           width=1280'
           directories=no`);
        } else {
          this.socketService.rejectCall();
        }
      }
    });
  }

  onCallClick(userId: String, roomId: String) {
    window.open('http://localhost:3000/call/' + roomId + '/' + 'true',
      'videoChat',
      `resizable=yes,
       toolbar=no,
       location=no,
       scrollbars=no,
       menubar=no,
       status=no,
       height=720,
       width=1280'
       directories=no`);
    this.socketService.call(userId, roomId);
  }

  onJoinClick(userId: String, roomId: String) {
    window.open('http://localhost:3000/call/' + roomId + '/' + 'false',
      'videoChat',
      `resizable=yes,
       toolbar=no,
       location=no,
       scrollbars=no,
       menubar=no,
       status=no,
       height=720,
       width=1280'
       directories=no`);
  }

  callInRoom(selectedUser?, room?) {
    let showButton;
    if (selectedUser) {
      this.chatService.privateRooms.filter((ele, index, arr) => {
        if (ele.users.includes(this.userId) && ele.users.includes(selectedUser._id)) {
          if (ele.inCall.length > 0 && !ele.inCall.includes(this.userId)) {
            showButton = true;
          } else {
            showButton = false;
          }
        }
      });
    } else if (room) {
      this.chatService.publicRooms.filter((ele, index, arr) => {
        if (ele._id === room._id) {
          if (ele.inCall.length > 0 && !ele.inCall.includes(this.userId)) {
            showButton = true;
          } else {
            showButton = false;
          }
        }
      });
    }
    return showButton;
  }

  canCall(selectedUser?, room?) {
    let canCall;
    if (selectedUser) {
      this.chatService.privateRooms.filter((ele, index, arr) => {
        if (ele.users.includes(this.userId) && ele.users.includes(selectedUser._id)) {
          if (ele.inCall.length > 0) {
            canCall = false;
          } else {
            canCall = true;
          }
        }
      });
    } else if (room) {
      canCall = this.chatService.publicRooms.find((ele, index, arr) => {
        if (ele._id === room._id) {
          if (ele.inCall.length > 0) {
            return false
          } else {
            return true;
          }
        }
      });
    }

    return canCall;
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.chatListSubscription.unsubscribe();
    this.notificationsSubscribtion.unsubscribe();
    this.roomListSubscribtion.unsubscribe();
    this.privateRoomCreationSubscribtion.unsubscribe();
    this.notificationsSeenSubscribtion.unsubscribe();
    this.receiveCallSubscription.unsubscribe();
    this.roomCallSubscription.unsubscribe();
    this.callLeaveSubscription.unsubscribe();
  }

}
