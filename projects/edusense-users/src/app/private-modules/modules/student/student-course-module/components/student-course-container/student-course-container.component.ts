import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../../provider/course-module/services';

export enum CourseViewEnum {
    ALL_COURSE = 'All Courses',
    BOOKMARK_COURSE = 'book-marked',
    MY_COURSE = 'my-courses',
}

@Component({
    selector: 'es-user-student-course-container',
    templateUrl: './student-course-container.component.html',
    styleUrls: ['./student-course-container.component.scss']
})
export class StudentCourseContainerComponent implements OnInit {
    // Data releated variables
    readonly htmlView = CourseViewEnum;
    activeView: CourseViewEnum = CourseViewEnum.ALL_COURSE;

    categoryList = [
        { label: CourseViewEnum.ALL_COURSE, value: null }
    ];
    activeTabCategory: string = CourseViewEnum.ALL_COURSE ;
    categoryId = null

    constructor(
        private courseService: CourseService
    ) { }

    ngOnInit(): void {
        this.getCategoryList();
        this.getUsersData();
    }

    getCategoryList() {
        const params = {
            search: JSON.stringify({ parentOnly: 1, status: 1 }),
            sortOrder: 'asc',
            sortBy: 'name'
        }
        this.courseService.getCategoriesList(params).subscribe((response) => {
            if (response) {
                const categoryList: any[] = response.payload.categories;
                this.categoryList = this.categoryList.concat(categoryList.map((e) => { return { label: e.name, value: e.category_id } }));
            }
        })
    }

    setCurrentTab(index) {
        this.activeView = this.htmlView.ALL_COURSE;
        this.activeTabCategory = this.categoryList[index].label;
        this.categoryId = this.categoryList[index].value
    }

    onShowCourseView(flag) {
        switch (flag) {
            case 'my-courses':
                this.activeView = this.htmlView.MY_COURSE;
                this.activeTabCategory = this.htmlView.MY_COURSE;
                break;

            case 'book-marked':
                this.activeView = this.htmlView.BOOKMARK_COURSE;
                this.activeTabCategory = this.htmlView.BOOKMARK_COURSE;
                break;
        }
    }

    getUsersData = () => {
        this.getUsersDataApiCall().subscribe(response => {
            let user = response['payload']?.user;
            if (!user) {
                this.updateUsersDataApiCall().subscribe(() => {
                    // DATA UPDATE DONE
                });
            } 
        });
    };

    getUsersDataApiCall = () => {
        return this.courseService.getUsersData();
    };

    updateUsersDataApiCall = () => {
        return this.courseService.updateUsersData();
    };
}
