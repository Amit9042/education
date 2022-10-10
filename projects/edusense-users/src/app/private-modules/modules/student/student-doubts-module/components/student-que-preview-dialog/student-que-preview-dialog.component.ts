import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AskQuestionService } from '../../services';
import { SharedService } from '@sharedModule/services';

@Component({
    selector: 'es-user-student-que-preview-dialog',
    templateUrl: './student-que-preview-dialog.component.html',
    styleUrls: ['./student-que-preview-dialog.component.scss']
})
export class StudentQuePreviewDialogComponent implements OnInit {
    providerUUID: string;
    constructor(
        public dialogRef: MatDialogRef<StudentQuePreviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private askQuestionService: AskQuestionService,
        private _sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.providerUUID = this._sharedService.getActiveEnterprise().provider_uuid;
    }

    askQuesstion() {
        const param = this.prepareRequestData(this.data);
        param['providerUUID'] = this.providerUUID;
        if (this.data._id) {
            this.askQuestionService.updateQuestion(param, this.data._id).subscribe(response => {
                this.onCloseDialog(response.payload._id);
            })
        } else {
            this.askQuestionService.askQuestion(param).subscribe(response => {
                this.onCloseDialog(response.payload._id);
            })
        }
    }

    prepareRequestData = (questionData) => {
        questionData['provider_id'] = this.data.teacher.provider_id;
        questionData['subject_id'] = this.data.subject.subject_id;
        questionData['grade_id'] = this.data.grade.grade_id;
        questionData['asked_user_id'] = this.data.teacher.user_id;

        if (questionData['description'] === '') {
            delete(questionData['description']);
        }
        if (this.data.uploadedImages && this.data.uploadedImages.length) {
            questionData['images'] = this.data.uploadedImages ? this.data.uploadedImages : this.data.subject.uploadedImages;
        }
        if (questionData.subject) {
            delete(questionData['subject']);
        }
        if (questionData.uploadedImages) {
            delete(questionData['uploadedImages']);
        }

        delete(questionData['grade']);
        delete(questionData['teacher']);
        delete(questionData['gradeFilter']);
        delete(questionData['teacherFilter']);
        delete(questionData['imageDesc']);

        return questionData;
    }

    onCloseDialog(isQuestionSubmited) {
        this.dialogRef.close(isQuestionSubmited);
    }
}
