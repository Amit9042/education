import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeChapterComponent } from './practice-chapter.component';

describe('PracticeChapterComponent', () => {
  let component: PracticeChapterComponent;
  let fixture: ComponentFixture<PracticeChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
