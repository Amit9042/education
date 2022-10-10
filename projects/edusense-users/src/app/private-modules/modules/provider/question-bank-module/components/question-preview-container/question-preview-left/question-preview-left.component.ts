import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FormBaseComponent } from '@sharedModule/components';
import { Location } from '@angular/common';

@Component({
  selector: 'es-user-question-preview-left',
  templateUrl: './question-preview-left.component.html',
  styleUrls: ['./question-preview-left.component.scss']
})
export class QuestionPreviewLeftComponent extends FormBaseComponent implements OnInit {

  // State Variable
  isListView = true;

  constructor(fb: FormBuilder, public location: Location) {
    super(fb);
   }

  ngOnInit(): void {
  }


  onToggleView = () => {
    this.isListView = !this.isListView;
  }

  onScroll = () => {

  }

  onBack = () => {
    this.location.back();
  }

}
