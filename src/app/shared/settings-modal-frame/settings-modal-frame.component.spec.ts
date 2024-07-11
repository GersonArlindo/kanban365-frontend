import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsModalFrameComponent } from './settings-modal-frame.component';

describe('SettingsModalFrameComponent', () => {
  let component: SettingsModalFrameComponent;
  let fixture: ComponentFixture<SettingsModalFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsModalFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsModalFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
