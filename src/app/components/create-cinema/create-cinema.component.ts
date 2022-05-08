import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CinemaService } from 'src/app/services/cinema.service';

@Component({
  selector: 'app-create-cinema',
  templateUrl: './create-cinema.component.html',
  styleUrls: ['./create-cinema.component.css'],
})
export class CreateCinemaComponent implements OnInit {
  @ViewChild('cinemaForm') cinemaForm: NgForm;
  statuses: boolean[] = [true, false];
  isLoading: boolean = false;
  error: string = null;
  success: string = null;

  constructor(private cinemaService: CinemaService) {}

  ngOnInit(): void {}

  onCreateCinema() {
    if (this.cinemaForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.cinemaService
      .createCinema(
        this.cinemaForm.value.name,
        // this.cinemaForm.value.photo,
        this.cinemaForm.value.code,
        // this.cinemaForm.value.seatsLayout,
        // this.cinemaForm.value.seatsAvailable,
        this.cinemaForm.value.startDate,
        this.cinemaForm.value.endDate,
        this.cinemaForm.value.status
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.isLoading = false;
          this.cinemaForm.reset();
          this.error = null;
          this.success = 'You successfully created a Cinema hall!';
        },
        (errorResponse) => {
          this.isLoading = false;
          if (errorResponse?.error?.message) {
            this.showErrorMessage(errorResponse);
            console.log(errorResponse.error.message);
          } else {
            this.error = errorResponse.message;
          }
          this.success = null;
          console.log(errorResponse);
        }
      );
  }

  private showErrorMessage(errorResponse) {
    if (errorResponse.error.message.includes('enddate')) {
      this.error = 'The end date must be greater than the start date.';
    } else if (errorResponse.error.message.includes('code')) {
      this.error = 'You must enter a unique code.';
    } else {
      this.error = 'You have not entered valid data. Try again.';
    }
  }
}
