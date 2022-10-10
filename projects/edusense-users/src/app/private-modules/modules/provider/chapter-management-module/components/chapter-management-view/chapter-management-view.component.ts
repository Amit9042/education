import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteConstant } from '@sharedModule/constants';
import { ChapterManagementListModel } from '../../models';

@Component({
    selector: 'es-user-chapter-management-view',
    templateUrl: './chapter-management-view.component.html',
    styleUrls: ['./chapter-management-view.component.scss']
})
export class ChapterManagementViewComponent implements OnInit {
    // Data variables
    chapterDetails: ChapterManagementListModel;

    constructor(private router: Router, private activeRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.routeSubscriber();
    }

    // Initialisation methods
    /**
     * get resolver data
     */
    private routeSubscriber = () => {
        this.activeRoute.data.subscribe(({ resolvedData }) => {
            if (resolvedData.chapterDetails) {
                this.chapterDetails = resolvedData.chapterDetails;
            }
        });
    };

    onChapterList() {
        this.router.navigate(['/' + RouteConstant.CHAPTER_MANAGEMENT_LIST]);
    }
}
