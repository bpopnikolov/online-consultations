import { TestBed, inject } from '@angular/core/testing';

import { VideoChatService } from './video-chat.service';

describe('VideoChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoChatService]
    });
  });

  it('should be created', inject([VideoChatService], (service: VideoChatService) => {
    expect(service).toBeTruthy();
  }));
});
