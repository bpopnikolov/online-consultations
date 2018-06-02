import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VideoChatService } from './shared/video-chat.service';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit, OnDestroy {

  micActive: Boolean = true;
  camActive: Boolean = true;
  @ViewChild('videoContainer') videoContainer: ElementRef;
  @ViewChild('mainVideo') mainVideo: ElementRef;
  @ViewChild('smallVideosContainer') smallVideosContainer: ElementRef;
  mainStreamCurrElement: HTMLVideoElement = null;

  initiator;
  userId = localStorage.getItem('userId');
  remoteConnections = [];

  roomId: string;
  roomName: string;

  constructor(
    private videoChatService: VideoChatService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2) {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.roomId = params.id;
      this.initiator = params.initiator === 'true' ? true : false;
    });
  }

  async ngOnInit() {
    if (this.initiator) {
      this.roomName = await this.videoChatService.createVideoRoom(this.roomId);
    }

    this.videoChatService.onLocalSteam().subscribe(async (stream) => {
      if (!this.initiator) {
        await this.videoChatService.joinVideoRoom(this.roomId);
      }
    });

    this.videoChatService.onVideoAdded().subscribe((event) => {
      this.remoteConnections.push(event.peer);
      this.createVideoElement(event.peer);
    });

    this.videoChatService.onVideoRemoved().subscribe((event) => {
      this.remoteConnections = this.remoteConnections.filter((peer) => {
        return peer.id !== event.peer.id;
      });
      const peerVideo = document.getElementById(event.video.id);

      if (this.isPeerVideoSwaped(peerVideo)) {
        this.resetCurrentSwap();
        this.mainStreamCurrElement = null;
      }

      this.renderer.removeChild(this.smallVideosContainer, peerVideo);
      console.log('video removed');
    });

    this.videoChatService.socket.emit('video-socket-join-room', {
      userId: this.userId,
      roomId: this.roomId
    });

    this.videoChatService.socket.on('joined-video-call', (userId) => {
      console.log(this.remoteConnections);
    });
  }

  isPeerVideoSwaped(peerVideo): Boolean {
    return this.mainStreamCurrElement === peerVideo ?
      true :
      false;
  }

  onMicButtonClick() {
    this.micActive ?
      this.videoChatService.muteStream() :
      this.videoChatService.unMuteStream();
    this.micActive = !this.micActive;
  }

  onCamButtonClick() {
    this.camActive ?
      this.videoChatService.pauseStream() :
      this.videoChatService.resumeStream();
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
    this.renderer.appendChild(this.smallVideosContainer.nativeElement, video);
  }

  swapStreams(event, peer) {

    this.resetCurrentSwap();

    if (this.isPeerVideoSwaped(event.target)) {
      this.mainStreamCurrElement = null;
      return;
    }

    // save the current element holding the main stream;
    this.mainStreamCurrElement = event.target;

    // set remote stream to main video
    this.mainVideo.nativeElement.srcObject = peer.stream;
    // move local stream to target
    event.target.srcObject = this.videoChatService.stream;

    event.target.muted = true;
    this.mainVideo.nativeElement.muted = false;

  }

  resetCurrentSwap(): void {
    if (this.mainStreamCurrElement) {
      // move back the remote stream
      this.mainStreamCurrElement.srcObject = this.mainVideo.nativeElement.srcObject;

      // set main stream to local stream
      this.mainVideo.nativeElement.srcObject = this.videoChatService.stream;

      this.mainStreamCurrElement.muted = false;
      this.mainVideo.nativeElement.muted = true;
    }
  }

  endCall() {
    window.close();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.videoChatService.disconnect();
    this.videoChatService.socket.emit('call-leave', { roomId: this.roomId, userId: this.userId });
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }
}
