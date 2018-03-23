import { TestBed, inject } from '@angular/core/testing';

import { SystemMessagesService } from './system-messages.service';

describe('SystemMessagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemMessagesService]
    });
  });

  it('should be created', inject([SystemMessagesService], (service: SystemMessagesService) => {
    expect(service).toBeTruthy();
  }));
});
