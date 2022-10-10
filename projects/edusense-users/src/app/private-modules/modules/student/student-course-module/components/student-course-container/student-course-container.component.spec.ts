import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseContainerComponent } from './student-course-container.component';

describe('StudentCourseListComponent', () => {
    let component: StudentCourseContainerComponent;
    let fixture: ComponentFixture<StudentCourseContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StudentCourseContainerComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StudentCourseContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
