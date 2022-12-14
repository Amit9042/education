import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingComponent } from './streaming.component';

describe('StudentStreamingComponent', () => {
  let component: StreamingComponent;
  let fixture: ComponentFixture<StreamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
