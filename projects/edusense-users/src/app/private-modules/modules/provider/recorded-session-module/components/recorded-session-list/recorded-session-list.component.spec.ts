import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordedSessionListComponent } from './recorded-session-list.component';

describe('RecordedSessionListComponent', () => {
  let component: RecordedSessionListComponent;
  let fixture: ComponentFixture<RecordedSessionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordedSessionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordedSessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
