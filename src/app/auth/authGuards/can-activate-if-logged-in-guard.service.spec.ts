import { TestBed, inject } from '@angular/core/testing';

import { CanActivateIfLoggedInGuard } from './can-activate-if-logged-in-guard.service';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateIfLoggedInGuard]
    });
  });

  it('should be created', inject([CanActivateIfLoggedInGuard], (service: CanActivateIfLoggedInGuard) => {
    expect(service).toBeTruthy();
  }));
});
