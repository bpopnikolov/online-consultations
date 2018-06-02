import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as SimpleWebRTC from 'simplewebrtc';
import * as io from 'socket.io-client';
import { AppConfigService } from '../../app-config.service';

@Injectable()
export class VideoChatService {

  private apiConfig: any;
  private webrtcConfig: any;
  public webrtc: any;
  userId = localStorage.getItem('userId');
  public stream: MediaStream;
  public socket: SocketIOClient.Socket;

  constructor(private appConfigService: AppConfigService) {
    this.webrtcConfig = appConfigService.get('webrtc');
    this.apiConfig = appConfigService.get('api');
    this.socket = io.connect(this.apiConfig.baseUrl);

    this.webrtc = new SimpleWebRTC({
      localVideoEl: 'main-video',
      autoRequestMedia: true,
      url: this.webrtcConfig.signalingServer,
      peerConnectionConfig: {
        'iceServers': [
          this.webrtcConfig.stunServer,
          this.webrtcConfig.turnServer
        ]
      }
    });
  }

  public createVideoRoom(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.webrtc.createRoom(id, (err, name) => {
        return err ?
          reject(err) :
          resolve(name);
      });
    });
  }

  public joinVideoRoom(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.webrtc.joinRoom(id, (err, roomDescription) => {
        return err ?
          reject(err) :
          resolve(roomDescription);
      });
    });
  }

  public disconnect() {
    this.webrtc.leaveRoom();
    this.webrtc.disconnect();
  }

  public onLocalSteam(): Observable<MediaStream> {
    return new Observable((observer) => {
      this.webrtc.on('localStream', (stream) => {
        this.stream = stream;
        observer.next(stream);
      });
    });
  }

  public onVideoAdded(): Observable<any> {
    return new Observable((observer) => {
      this.webrtc.on('videoAdded', (video, peer) => {
        observer.next({ video, peer });
      });
    });
  }

  public onVideoRemoved(): Observable<any> {
    return new Observable((observer) => {
      this.webrtc.on('videoRemoved', (video, peer) => {
        observer.next({ video, peer });
      });
    });
  }

  public pauseStream(): void {
    this.webrtc.pauseVideo();
  }
  public resumeStream(): void {
    this.webrtc.resumeVideo();
  }

  public muteStream(): void {
    this.webrtc.mute();
  }
  public unMuteStream(): void {
    this.webrtc.unmute();
  }



}
