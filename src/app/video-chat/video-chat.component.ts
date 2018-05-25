import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WebrtcService } from '../webrtc.service';




@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit, OnDestroy {

  micActive: Boolean;
  camActive: Boolean;
  @ViewChild('mainVideo') mainVideo: ElementRef;
  @ViewChild('audio') audio: ElementRef;
  @ViewChild('smallVideoContainer') smallVideoContainer: ElementRef;
  @ViewChild('mySmallVideo') mySmallVideo: ElementRef;

  constraints = {
    video: {
      // deviceId: camera.deviceId ? { exact: camera.deviceId } : undefined,
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
    },
    audio: true
  }

  initiator;
  userId = localStorage.getItem('userId');
  peer;
  remoteStreams;
  currentMainStream;

  constructor(
    private webRTCService: WebrtcService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2) {

    this.activatedRoute.params.subscribe((params: Params) => {
      this.webRTCService.roomId = params.id;
      this.initiator = params.initiator;
      this.peer = new Peer(this.userId, {
        host: '/', port: 443, path: '/peerjs',
        config: {
          'iceServers': [
            { url: 'stun:stun1.l.google.com:19302' },
            {
              url: 'turn:numb.viagenie.ca',
              credential: 'muazkh',
              username: 'webrtc@live.com'
            }
          ]
        }
      });
    });
    console.log(this.peer);
  }

  async ngOnInit() {
    await this.getMedia(this.constraints);

    this.webRTCService.socket.emit('video-socket-join-room',
      {
        userId: this.userId,
        roomId: this.webRTCService.roomId
      });

    this.webRTCService.socket.on('joined-video-call', (userId) => {
      console.log('CALLING! ' + userId);
      const call = this.peer.call(userId, this.webRTCService.stream);
      call.on('stream', (remoteStream: MediaStream) => {
        console.log('got stream');

        this.connectionCloseHandler(this.peer.connections[userId]);
        this.createVideoElement(userId);
      });
    });

    this.peer.on('call', (call) => {
      console.log('someone is calling');

      call.answer(this.webRTCService.stream);
      call.on('stream', (remoteStream: MediaStream) => {
        console.log('got stream');

        this.connectionCloseHandler(this.peer.connections[call.peer]);
        this.createVideoElement(call.peer);
      });
    });


    this.peer.on('disconnected', (peer) => {
      console.log(peer);
      console.log('diconnected');
    });

    this.peer.on('close', (peer) => {
      console.log(peer);
      console.log('destroied');
    });

  }

  async getMedia(constraints) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log(stream.getVideoTracks());
      this.webRTCService.stream = stream;
      this.mainVideo.nativeElement.srcObject = stream;
      this.mainVideo.nativeElement.muted = true;

      this.micActive = stream.getAudioTracks()[0].enabled ?
        stream.getAudioTracks()[0].enabled : false;

      this.camActive = stream.getVideoTracks()[0].enabled ?
        stream.getVideoTracks()[0].enabled : false;
    }
  }

  onMicButtonClick() {
    if (this.webRTCService.stream) {
      const audioTracks = this.webRTCService.stream.getAudioTracks();
      if (this.micActive) {
        audioTracks.forEach((track: MediaStreamTrack) => {
          console.log('Mic disabled');
          this.micActive = false;
          track.enabled = false;
        });
      } else {
        audioTracks.forEach((track: MediaStreamTrack) => {
          console.log('Mic enabled');
          this.micActive = true;
          track.enabled = true;
        });
      }
    }
  }

  onCamButtonClick() {
    if (this.webRTCService.stream) {
      const videoTracks = this.webRTCService.stream.getVideoTracks();

      if (this.camActive) {
        videoTracks.forEach((track: MediaStreamTrack) => {
          console.log('Cam disabled');
          this.camActive = false;
          track.enabled = false;
        });
      } else {
        videoTracks.forEach((track: MediaStreamTrack) => {
          console.log('Cam enabled');
          this.camActive = true;
          track.enabled = true;
        });
      }
    }
  }

  createVideoElement(id) {
    const remVideo = this.renderer.createElement('video');

    const remoteStream = this.peer.connections[id][0].remoteStream;
    const localStream = this.peer.connections[id][0].localStream;

    this.renderer.addClass(remVideo, 'small-video');
    this.renderer.setAttribute(remVideo, 'id', id);
    this.renderer.setAttribute(remVideo, 'autoplay', 'true');

    if (this.mainVideo.nativeElement.srcObject === localStream) {
      remVideo.srcObject = localStream;
      this.renderer.setAttribute(remVideo, 'muted', 'true');
      this.mainVideo.nativeElement.srcObject = remoteStream;
    } else {
      remVideo.srcObject = remoteStream;
    }

    this.renderer.listen(remVideo, 'click', (event) => { this.swapStreams(event) });
    this.renderer.appendChild(this.smallVideoContainer.nativeElement, remVideo);
  }

  swapStreams(event) {
    console.log(event.target);

    const remoteStream = this.peer.connections[event.target.id][0].remoteStream;
    const localStream = this.peer.connections[event.target.id][0].localStream;

    if (this.mainVideo.nativeElement.srcObject === remoteStream) {
      this.mainVideo.nativeElement.srcObject = localStream;
      this.mainVideo.nativeElement.muted = true;
      event.target.srcObject = remoteStream;
      event.target.muted = false;
    } else {
      this.mainVideo.nativeElement.srcObject = remoteStream;
      this.mainVideo.nativeElement.muted = false;
      event.target.srcObject = localStream;
      event.target.muted = true;
    }
  }

  connectionCloseHandler(connection) {

    console.log('close event added');
    console.log(connection);

    connection[0].on('close', () => {
      console.log('stream ended');

      const localStream = connection[0].localStream;
      const remoteStream = connection[0].remoteStream;

      const children: any[] = Array.from(this.smallVideoContainer.nativeElement.children);

      console.log(children);
      console.log(this.peer.connections);

      for (let i = 0; i < children.length; i++) {
        if (children[i].id === connection[0].peer) {

          if (children[i].srcObject === localStream && children.length > 1) {
            console.log('more than one user');
            const connections: any = this.peer.connections;
            for (const con in connections) {
              if (connections[con][0].remoteStream.id === this.mainVideo.nativeElement.srcObject.id) {

                children.forEach((ele, index, arr) => {
                  if (ele.id === connection[con][0].peer) {
                    ele.srcObject = connection[con][0].remoteStream;
                  }
                });
              }
            }
          }
          children[i].remove();
          // this.renderer.removeChild(this.smallVideoContainer.nativeElement, children[i]);
          delete this.peer.connections[connection[0].peer];
          children.splice(i, 1);
        }
      }

      if (children.length === 0) {
        this.mainVideo.nativeElement.srcObject = this.webRTCService.stream;
      }

    });

  }

  // audioAnalyser(stream: MediaStream) {
  //   let audioCtx = new AudioContext();
  //   let audioSource = audioCtx.createMediaStreamSource(stream);
  //   let analyser = audioCtx.createAnalyser();

  //   audioSource.connect(analyser);
  //   let freqData = new Uint8Array(analyser.frequencyBinCount);

  //   function renderFrame() {
  //     requestAnimationFrame(renderFrame);
  //     analyser.getByteFrequencyData(freqData);
  //     // console.log(freqData);
  //   }

  //   console.log(this.audio);
  //   renderFrame();
  // }

  endCall() {
    window.close();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.webRTCService.socket.emit('call-leave',
      {
        roomId: this.webRTCService.roomId,
        userId: this.userId
      });
    this.peer.connections.forEach(connection => {
      connection.close();
    });
    this.peer.destroy();
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }
}
