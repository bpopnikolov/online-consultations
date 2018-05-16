import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { Message } from './models/message.model';

@Injectable()
export class SocketService {

  socket: SocketIOClient.Socket;

  constructor() {

  }

  connectSocket(userId: String) {
    this.socket = io.connect('/', { query: { userId: userId } });
  }

  sendMessage(message: Message) {
    this.socket.emit('add-message', message);
  }

  markNotificationAsSeen(room, userId) {
    this.socket.emit('notifications-seen', { room: room, userId: userId });
  }

  notificationSeenResponse(): any {
    const observable = new Observable(observer => {
      this.socket.on('notifications-seen-response', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;

  }

  createRoom(roomName: String, creatorId: String, users: any[]) {

    this.socket.emit('create-chatroom', {
      roomName: roomName,
      creatorId: creatorId,
      users: users
    });

  }

  createPrivateRoom(userId, withUser) {
    this.socket.emit('create-private-room', ({
      userId: userId,
      withUser: withUser
    }));
  }

  joinRoom(room) {
    this.socket.emit('join-room', { room: room });
  }

  addPersonsToRoom(data) {
    this.socket.emit('add-person', data);
  }

  privateRoomSelected(): any {
    const observable = new Observable(observer => {
      this.socket.on('create-private-room-response', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  leaveChatRoom(roomId: String, userId: String): any {
    this.socket.emit('leave-chatroom', {
      roomId: roomId,
      userId: userId
    });

    const observable = new Observable(observer => {
      this.socket.on('leave-chatroom-response', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  getRoomList(userId: String): any {
    this.socket.emit('room-list', { userId: userId });

    const observable = new Observable(observer => {
      this.socket.on('room-list-response', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  /*
* Method to receive add-message-response event.
*/
  receiveMessages(): any {
    const observable = new Observable(observer => {
      this.socket.on('add-message-response', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  /*
  * Method to recive notifications-response event
  */
  getNotifcations(userId): any {

    this.socket.emit('notifications', { userId: userId });

    const observable = new Observable(observer => {
      this.socket.on('notifications-response', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  /*
	* Method to receive chat-list-response event.
	*/
  getChatList(userId: string): any {

    this.socket.emit('chat-list', { userId: userId });

    const observable = new Observable(observer => {
      this.socket.on('chat-list-response', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  // Call Logic

  call(userId: String, roomId: String) {
    this.socket.emit('call', { userId: userId, roomId: roomId });
  }

  onReceiveCall(): any {
    const observable = new Observable(observer => {
      this.socket.on('receiving-call', (data) => {
        observer.next(data);
      });

    });
    return observable;
  }

  onRoomCall(): any {
    const observable = new Observable(observer => {
      this.socket.on('room-call', (data) => {
        observer.next(data);
      });

    });
    return observable;
  }

  onCallLeave(): any {
    const observable = new Observable(observer => {
      this.socket.on('user-call-leave', (data) => {
        observer.next(data);
      });

    });
    return observable;
  }

  answerCall(userId, roomId) {
    this.socket.emit('call-answer', { answer: true, userId: userId, roomId: roomId });
  }

  rejectCall() {
    this.socket.emit('call-answer', { answer: false });
  }


  singOut() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
