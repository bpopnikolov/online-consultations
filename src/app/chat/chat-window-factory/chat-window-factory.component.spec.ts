import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWindowFactoryComponent } from './chat-window-factory.component';

describe('ChatWindowFactoryComponent', () => {
  let component: ChatWindowFactoryComponent;
  let fixture: ComponentFixture<ChatWindowFactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatWindowFactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWindowFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
