import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderChatSelectorComponent } from './header-chat-selector.component';

describe('HeaderChatSelectorComponent', () => {
  let component: HeaderChatSelectorComponent;
  let fixture: ComponentFixture<HeaderChatSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderChatSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderChatSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
