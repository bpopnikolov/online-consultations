import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCreationDialogComponent } from './room-creation-dialog.component';

describe('RoomCreationDialogComponent', () => {
  let component: RoomCreationDialogComponent;
  let fixture: ComponentFixture<RoomCreationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomCreationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
