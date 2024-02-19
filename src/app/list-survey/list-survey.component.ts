//<!-- Mogili Spoorthy Reddy,Sahithi Edunuri, Harshini Reddy Revuri, Mogili Keerthy Reddy-->
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize } from 'rxjs/operators';
import { throwError, tap } from 'rxjs';

// Backend API URL
const survey_api = 'http://localhost:8080/surveyAll';

// Business logic for list of surveys
@Component({
  selector: 'app-list-survey',
  templateUrl: './list-survey.component.html',
  styleUrls: ['./list-survey.component.css']
})
export class ListSurveyComponent {
  surveys: any[] = [];  

  constructor(private http: HttpClient, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadSurveys(); 
  }


  loadSurveys(): void {
    this.spinner.show(); // Show the spinner when fetching response

    this.http.get<any[]>(survey_api).pipe( // Firing http call to backend and handle exceptions if any
      tap(response => {
        this.surveys = response;
      }),
      catchError(error => {
        this.toastr.error('Failed to load surveys, Please try again');
        console.error('Failed to load surveys:', error);
        return throwError(error);
      }),
      finalize(() => {
        this.spinner.hide();
      })
    ).subscribe();
  }
}
