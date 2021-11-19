import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Clubschedule } from './clubschedule.component';

describe('ScheduleComponent', () => {
  let component: Clubschedule;
  let fixture: ComponentFixture<Clubschedule>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Clubschedule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Clubschedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
