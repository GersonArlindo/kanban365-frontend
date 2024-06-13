import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUserModalFrameComponent } from './profile-user-modal-frame.component';

describe('ProfileUserModalFrameComponent', () => {
  let component: ProfileUserModalFrameComponent;
  let fixture: ComponentFixture<ProfileUserModalFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileUserModalFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileUserModalFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
