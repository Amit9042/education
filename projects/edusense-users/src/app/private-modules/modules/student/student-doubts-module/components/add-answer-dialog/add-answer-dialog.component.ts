import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray
} from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionAnswerService } from '../../services';
import { FormBaseComponent } from '@sharedModule/components';
import { ValidationConstant, FileSizeEnum, AppMessageConstants } from '@sharedModule/constants';
import { SharedService } from '@sharedModule/services';
import { isValidImageType } from '@sharedModule/functions';

@Component({
  selector: 'es-user-add-answer-dialog',
  templateUrl: './add-answer-dialog.component.html',
  styleUrls: ['./add-answer-dialog.component.scss']
})
export class AddAnswerDialogComponent extends FormBaseComponent implements OnInit{
  @Input() dropdownData: any;

  // Form group variables
  myControl = new FormControl();
  addAnswerForm: FormGroup;

  // Constants variables
  validationMsg = new ValidationConstant();

  uploadedImage = [];
  selectedImage = [];
  imageUploadDetails;
  isApiCall = true;

  constructor(
      fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<AddAnswerDialogComponent>,
      public dialog: MatDialog,
      private router: Router,
      private sharedService: SharedService,
      private questionAnswerService: QuestionAnswerService
  ) { 
    super(fb)
  }

  ngOnInit(): void {
      this.initialize();
  }

  initialize = () => {
      this.createAddAnswerForm();
      this.checkValidation();
      if (this.data?.isEdit) {
          this.patchFormValue();
      }
  };

  createAddAnswerForm = () => {
      this.addAnswerForm = this.createForm({
        description: [
              '',
              [
                  Validators.required,
                  Validators.minLength(2),
                  Validators.maxLength(1000)
              ]
          ],
          imageDesc: this.fb.array([])
      });
  };

  checkValidation = () => {
    this.formControls['description'].valueChanges.subscribe(value => {
        if (!this.formControls['description'].value && !this.uploadedImage.length) {
            this.formControls['description'].setValidators([
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(1000)
            ]);
        }
    })
  }

  patchFormValue = () => {
      this.addAnswerForm.patchValue({
          description: this.data.description
      });
      this.data.images.forEach(element => {
        (<FormArray>this.addAnswerForm.controls.imageDesc).push(new FormControl(element.description, Validators.maxLength(255)));
        this.uploadedImage.push({
            'url': element.url,
            'resolution': element.resolution
        });
        const file = [];
        const filename = element.url.split('/').pop();
        file.push({'name': filename})
        this.selectedImage.push({
            files : file
        })
      });
      if (this.data.images) {
        this.formControls['description'].clearValidators();
        this.formControls['description'].updateValueAndValidity();
      }
  }

  onRemoveImage = (index) => {
      this.selectedImage.splice(index, 1);
      this.uploadedImage.splice(index, 1);
      (<FormArray>this.addAnswerForm.controls.imageDesc).removeAt(index);
      if (this.uploadedImage.length === 0) {
        this.formControls['description'].setValidators([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(1000)
        ]);
        this.formControls['description'].updateValueAndValidity();
      }
  }

  onFileUpload = (event) => {
      if (event.target.files && event.target.files[0]) {
          if (this.selectedImage.length < 5) {
              const file = event.target.files[0];
              if (isValidImageType(event.target.files[0].type)) {
                  if (
                      event.target.files[0].size > FileSizeEnum.FIVE_MB_IMAGE_SIZE
                  ) {
                      this.sharedService.setSnackBar(AppMessageConstants.FILE_SIZE_GREATER_THEN_FIVE_MB);
                      event.target.value = null;
                  } else {
                      const reader = new FileReader();
                      reader.onloadend = (loadEvent: any) => {
                            const that = this;
                            this.imageUploadDetails = loadEvent.target.result;
                            const image = [{
                                reqKey: 'image',
                                files: event.target.files
                            }]
                            const img = new Image();
                            img.src = this.imageUploadDetails;
                            img.onload = function(){
                                that.questionAnswerService.fileUpload(image).subscribe(response =>{
                                    that.selectedImage.push(image[0]);
                                    (<FormArray>that.addAnswerForm.controls.imageDesc).push(new FormControl('', Validators.maxLength(255)));
                                    that.uploadedImage.push({
                                        'url': `${response.payload.baseUrl}${response.payload.imageUrl}`,
                                        'resolution': `${img.height}X${img.width}`
                                    });
                                    that.formControls['description'].clearValidators();
                                    that.formControls['description'].updateValueAndValidity();
                                })
                            }
                      };
                      reader.readAsDataURL(file);
                  }
              } else {
                  this.sharedService.setSnackBar(AppMessageConstants.FILE_TYPE_ERROR);
                  event.target.value = null;
              }
          } else {
              this.sharedService.setSnackBar(AppMessageConstants.FIVE_IMAGES_ALLOWED);
              event.target.value = null;
          }
      }
  };

  onBrowseFile(id) {
      document.getElementById(id).click();
  }

  onSelectChangeEvent = (event, type) => {};

  onSubmitAddAnswerForm = (form: FormGroup) => {
      if (this.onSubmit(form)) {
        const params = this.prepareParameter(form.value);
        const questionId = this.data?._id;
        const answerId = this.data?.answerId;
        this.data.isEdit ? this.updateAnswer(questionId, answerId, params) : this.addAnswer(questionId, params);
      }
  };

  addAnswer = (questionId, params) => {
    this.questionAnswerService.addAnswer(questionId, params).subscribe(response => {
        this.onCloseDialog(this.isApiCall);
      })
  }

  updateAnswer = (questionId, answerId, params) => {
    this.questionAnswerService.updateAnswer(questionId, answerId, params).subscribe(response => {
        this.onCloseDialog(this.isApiCall);
    })
  }

  prepareParameter = (formValue) => {
    if (this.uploadedImage.length) {
      const imageDescControl = <FormArray>this.addAnswerForm.controls.imageDesc;
      for (let i = 0; i < this.selectedImage.length ; i++) {
          this.uploadedImage[i]['description'] = imageDescControl.controls[i].value;
      }
      formValue['images'] = this.uploadedImage;
    } else {
        formValue['images'] = [];
    }
    delete(formValue['imageDesc']);

    return formValue;
  }

  onCloseDialog(isApiCall?) {
      this.dialogRef.close(isApiCall);
  }

  // Helpers
  get formControls() {
      return this.addAnswerForm.controls;
  }

  get imageDescFormArray() {
      return this.addAnswerForm.get("imageDesc") as FormArray;
  }
}
