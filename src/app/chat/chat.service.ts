import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { SelectedUser } from './models/selectedUser.model';
import { Subject } from 'rxjs/Subject';
import { Room } from './models/room.model';

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

    return this.http.post('/chat/getMessages', body, { headers: headers }).map((response: Response) => {
      return response.json();
    }).catch((error: Response) => {
      return Observable.throw(error.json());
    });
  }

  setSelectedUser(user: SelectedUser) {

    this.selectedUser = user;
    this.onUserSelected.next(this.selectedUser);
  }

  setSelectedRoom(room) {

    this.selectedRoom = new Room(room._id, room.name, room.type, room.users, room.inCall);
    this.onRoomSelected.next(this.selectedRoom);
  }


}
