import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordedSessionViewComponent } from './recorded-session-view.component';

describe('RecordedSessionViewComponent', () => {
  let component: RecordedSessionViewComponent;
  let fixture: ComponentFixture<RecordedSessionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordedSessionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordedSessionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
