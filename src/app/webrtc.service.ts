import { Injectable, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';



@Injectable()
export class WebrtcService implements OnDestroy {

  userId = localStorage.getItem('userId');
  roomId;
  videoTrack: MediaStreamTrack;
  audioTrack: MediaStreamTrack;
  stream: MediaStream;
  socket: SocketIOClient.Socket;

  private BASE_URL = './';


  constructor() {

    this.socket = io.connect(this.BASE_URL);

  }




  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }


}
