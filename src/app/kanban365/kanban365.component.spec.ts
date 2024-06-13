import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kanban365Component } from './kanban365.component';

describe('Kanban365Component', () => {
  let component: Kanban365Component;
  let fixture: ComponentFixture<Kanban365Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Kanban365Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kanban365Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
