import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Room } from './models/room.model';
import { SelectedUser } from './models/selectedUser.model';

@Injectable()
export class ChatService {

  userId = localStorage.getItem('userId');
  users = [];
  infoUsers = [];
  publicRooms: Room[] = [];
  privateRooms: Room[] = [];
  notifications = [];
  selectedUser: SelectedUser = null;
  selectedRoom: Room = null;
  onUserSelected = new Subject<SelectedUser>();
  onRoomSelected = new Subject<Room>();
  onUsersChanged = new Subject();
  constructor(private http: HttpClient) { }

  getMessages(fromId, toId) {
    const body = JSON.stringify({
      fromId: fromId,
      toId: toId
    });
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post('/chat/getMessages', body, {
      headers: headers
    });
  }

  setSelectedUser(user: SelectedUser) {
    this.selectedUser = user;
    this.onUserSelected.next(this.selectedUser);
  }

  addOnlineUser(user: any) {
    const onlineUser = this.users.find((u) => u._id === user._id);

    if (!onlineUser) {
      this.users.push(user);
      this.onUsersChanged.next(this.users);
    }
  }
  removeOnlineUser(user: any) {
    this.users =
      this.users.filter((u) => u._id !== user._id);
    this.onUsersChanged.next(this.users);
  }

  setSelectedRoom(room) {
    this.selectedRoom = new Room(room._id, room.name, room.type, room.users, room.inCall);
    this.onRoomSelected.next(this.selectedRoom);
  }

  getUserName(id) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(`/chat/getUserName/${id}`);
  }

}
