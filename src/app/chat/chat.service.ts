import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Room } from './models/room.model';
import { SelectedUser } from './models/selectedUser.model';

@Injectable()
export class ChatService {

  userId = localStorage.getItem('userId');
  onlineUsers = [];
  publicRooms: Room[] = [];
  privateRooms: Room[] = [];
  notifications = [];
  selectedUser: SelectedUser = null;
  selectedRoom: Room = null;
  onUserSelected = new Subject<SelectedUser>();
  onRoomSelected = new Subject<Room>();
  onOnlineUsersChanged = new Subject();
  constructor(private http: Http) { }

  getMessages(fromId, toId) {
    const body = JSON.stringify({
      fromId: fromId,
      toId: toId
    });
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.post('/chat/getMessages', body, {
      headers: headers
    }).map((response: Response) => {
      return response.json();
    }).catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }

  setSelectedUser(user: SelectedUser) {
    this.selectedUser = user;
    this.onUserSelected.next(this.selectedUser);
  }

  addOnlineUser(user: any) {
    const onlineUser = this.onlineUsers.find((u) => u._id === user._id);

    if (!onlineUser) {
      this.onlineUsers.push(user);
      this.onOnlineUsersChanged.next(this.onlineUsers);
    }
  }
  removeOnlineUser(user: any) {
    this.onlineUsers =
      this.onlineUsers.filter((u) => u._id !== user._id);
    this.onOnlineUsersChanged.next(this.onlineUsers);
  }

  setSelectedRoom(room) {
    this.selectedRoom = new Room(room._id, room.name, room.type, room.users, room.inCall);
    this.onRoomSelected.next(this.selectedRoom);
  }


}
