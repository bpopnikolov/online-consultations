import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as SimpleWebRTC from 'simplewebrtc';
import { WebrtcService } from '../webrtc.service';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit, OnDestroy {

  micActive: Boolean = true;
  camActive: Boolean = true;
  @ViewChild('mainVideo') mainVideo: ElementRef;
  @ViewChild('audio') audio: ElementRef;
  @ViewChild('smallVideoContainer') smallVideoContainer: ElementRef;
  @ViewChild('mySmallVideo') mySmallVideo: ElementRef;

  initiator;
  userId = localStorage.getItem('userId');
  peer;
  webrtc;
  remoteStreams;
  currentMainStream;
  remoteConnections = [];

  constructor(
    private webRTCService: WebrtcService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2) {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.webRTCService.roomId = params.id;
      this.initiator = params.initiator === 'true' ? true : false;
    });
  }

  async ngOnInit() {
    const stun = {
      'url': 'stun:stun.l.google.com:19302'
    };

    const turn = {
      'url': 'turn:13.250.13.83:3478?transport=udp',
      'username': 'YzYNCouZM1mhqhmseWk6',
      'credential': 'YzYNCouZM1mhqhmseWk6'
    };
    const webrtc = new SimpleWebRTC({
      localVideoEl: 'main-video',
      remoteVideosEl: 'small-videos-container',
      autoRequestMedia: true,
      url: 'https://signal-master-oc.herokuapp.com',
      peerConnectionConfig: { 'iceServers': [stun, turn] },
      peerConnectionConstraints: { 'iceServers': [stun, turn] }
    });
    this.webrtc = webrtc;
    console.log(this.webrtc);
    this.webrtc.on('turnservers', (args) => {
      console.log(args);
    })
    if (this.initiator) {
      webrtc.createRoom(this.webRTCService.roomId, (err, name) => {
        console.log(`Room created ${name}`);
      })
    } else {
    }
    webrtc.on('localStream', (stream) => {
      this.webRTCService.stream = stream;
      if (!this.initiator) {
        webrtc.joinRoom(this.webRTCService.roomId, (arg) => {
        });
      }
    });

    webrtc.on('videoAdded', (video, peer) => {
      console.log(video);
      console.log(peer);
      this.remoteConnections.push(peer);
      this.createVideoElement(peer);
    })

    // console.log(this.peer);
    this.webRTCService.socket.emit('video-socket-join-room', {
      userId: this.userId,
      roomId: this.webRTCService.roomId
    });

    this.webRTCService.socket.on('joined-video-call', (userId) => {
      console.log(this.remoteConnections);
    });
  }

  onMicButtonClick() {
    this.micActive ?
      this.webrtc.mute() :
      this.webrtc.unmute();
    this.micActive = !this.micActive;
  }

  onCamButtonClick() {
    this.camActive ?
      this.webrtc.pauseVideo() :
      this.webrtc.resumeVideo();
    this.camActive = !this.camActive;
  }

  createVideoElement(peer) {
    const video = this.renderer.createElement('video');

    // this.renderer.addClass(video, 'small-video');
    this.renderer.setAttribute(video, 'id', `${peer.id}_video_incoming`);
    this.renderer.setAttribute(video, 'autoplay', 'true');
    video.srcObject = peer.stream;

    this.renderer.listen(video, 'click', (event) => {
      this.swapStreams(event, peer)
    });
    this.renderer.appendChild(this.smallVideoContainer.nativeElement, video);
    console.log('video tag was created');
  }

  swapStreams(event, peer) {

    if (this.mainVideo.nativeElement.srcObject === peer.stream) {
      this.mainVideo.nativeElement.srcObject = this.webRTCService.stream;
      this.mainVideo.nativeElement.muted = true;
      event.target.srcObject = peer.stream;
      event.target.muted = false;
    } else {
      this.mainVideo.nativeElement.srcObject = peer.stream;
      this.mainVideo.nativeElement.muted = false;
      event.target.srcObject = this.webRTCService.stream;
      event.target.muted = true;
    }
  }

  endCall() {
    window.close();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.webRTCService.socket.emit('call-leave', { roomId: this.webRTCService.roomId, userId: this.userId });
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }
}
