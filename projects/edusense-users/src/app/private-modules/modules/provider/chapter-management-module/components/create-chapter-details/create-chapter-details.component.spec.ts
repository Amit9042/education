import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChapterDetailsComponent } from './create-chapter-details.component';

describe('CreateChapterDetailsComponent', () => {
  let component: CreateChapterDetailsComponent;
  let fixture: ComponentFixture<CreateChapterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateChapterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChapterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
