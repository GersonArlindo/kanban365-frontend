import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileModalFrameComponent } from './profile-modal-frame.component';

describe('ProfileModalFrameComponent', () => {
  let component: ProfileModalFrameComponent;
  let fixture: ComponentFixture<ProfileModalFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileModalFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileModalFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
