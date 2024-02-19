import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
const survey_url = 'http://localhost:8080/addSurvey';
@Component({
  selector: 'app-student-survey',
  templateUrl: './student-survey.component.html',
  styleUrls: ['./student-survey.component.css'],
  providers: [DatePipe]
})
export class StudentSurveyComponent implements OnInit {

  surveyForm: FormGroup;
  // List of interests
  interestedInUnis: string[] = ['Friends', 'Television', 'Internet', 'Other'];
  campusOption = [
    { name: 'Students', value: 'Students' },
    { name: 'Location', value: 'Location' },
    { name: 'Campus', value: 'Campus' },
    { name: 'Atmosphere', value: 'Atmosphere' },
    { name: 'Dorm Rooms', value: 'Dorms' },
    { name: 'Sports', value: 'Sports' },
  ];
  date = new Date();
  constructor(private builder: FormBuilder, private http: HttpClient, private route: Router, private spinner: NgxSpinnerService, private notification: ToastrService, private datePipe: DatePipe) { 
  }

  // Survey form attributes model
  ngOnInit(): void {
    this.surveyForm = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      telephoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email]],
      "url": new FormControl(null),
      likeAbtCampus: this.builder.array([], Validators.required),
      interestedInUni: ['', Validators.required],
      recommendation: ['', Validators.required],
      comments: ''
    });
  }

  onCheckboxChange(e: any) { // functionality for check box
    const checkArray: FormArray = this.surveyForm.get('likeAbtCampus') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  sendSurveyForm(surveyFormData: any): void {
    this.spinner.show();
    this.http.post(survey_url, surveyFormData, { headers: { "Access-Control-Allow-Origin": "*" } }) // API call to backend to save data
      .pipe(
        catchError(error => { // Handling errors in front-end
          this.notification.error('Error uploading survey, Please try again');
          console.error('Failed to submit survey form:', error);
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.notification.info('Survey sent successfully');
        this.route.navigate(['/home']);
        this.spinner.hide();
      });
  }

  // Submit button functionality, validates the input and fires an API call
  onSubmit() {
    if (this.surveyForm.valid) {
      const survey = { ...this.surveyForm.value };
      survey.likeAbtCampus = survey.likeAbtCampus.join(', ');
      this.sendSurveyForm(survey);
    }
  }

  // Reset the entire form to default value
  onCancel() {
    this.surveyForm.reset();
  }

}
