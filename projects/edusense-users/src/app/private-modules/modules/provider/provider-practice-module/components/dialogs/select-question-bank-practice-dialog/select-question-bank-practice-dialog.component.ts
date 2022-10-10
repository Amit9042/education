import { Component, OnInit, Inject } from '@angular/core';
import {
    MatDialogRef,
    MatDialog,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { OperatorEnum } from '@sharedModule/constants';
import { PracticeService } from '../../../service';

@Component({
    selector: 'es-user-select-question-bank-practice-dialog',
    templateUrl: './select-question-bank-practice-dialog.component.html',
    styleUrls: ['./select-question-bank-practice-dialog.component.scss']
})
export class SelectQuestionBankPracticeDialogComponent implements OnInit {
    // Data related variables
    folderList: any[] = [];
    selectedFolderArray: any[] = [];
    criteriaArray = [];

    // State variables
    criteria = {};
    isLoadingResults = false;

    constructor(
        public dialogRef: MatDialogRef<
            SelectQuestionBankPracticeDialogComponent
        >,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private practiceService: PracticeService
    ) {}

    ngOnInit() {
        this.getQuizFolderList();
        if (this.data && this.data.chapters) {
            this.selectedFolderArray = [...this.data.chapters];
        }
    }

    getQuizFolderList = () => {
        this.isLoadingResults = true;
        this.practiceService
            .getQuizFolderList(this.queryParams())
            .subscribe((response) => {
                this.isLoadingResults = false;
                this.folderList = response.payload.content;
            });
    };

    isSelectedFolder = (folder) => {
        let isSelected: any = '';
        this.selectedFolderArray.forEach((element) => {
            if (element.id === folder.id) {
                isSelected = true;
            }
        });
        return isSelected;
    };

    onSelectFolder = (event, folder) => {
        if (event.checked) {
            this.selectedFolderArray.push(folder);
        } else {
            this.selectedFolderArray = this.selectedFolderArray.filter(
                (item) => item.id !== folder.id
            );
        }
    };

    onAddFolder = (folders) => {
        this.onCloseDialog(folders);
    };

    onCloseDialog(folders) {
        this.dialogRef.close(folders);
    }

    // Helper methods
    queryParams = (): any => {
        this.criteriaArray = [
            {
                column: 'gradeId',
                operator: OperatorEnum.EQUALS,
                values: [this.data.grade_id]
            },
            {
                column: 'subjectId',
                operator: OperatorEnum.EQUALS,
                values: [this.data.subject_id]
            },
            {
                column: 'deleted',
                operator: OperatorEnum.FALSE
            }
        ];
        return {
            offset: 1,
            limit: 2147483647,

            sort: {
                column: 'title',
                sortType: 'asc'
            },
            criteria: this.criteriaArray
        };
    };
}
