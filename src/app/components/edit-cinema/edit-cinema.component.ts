import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Cinema } from 'src/app/models/cinema.model';
import { CinemaService } from 'src/app/services/cinema.service';

@Component({
  selector: 'app-edit-cinema',
  templateUrl: './edit-cinema.component.html',
  styleUrls: ['./edit-cinema.component.css'],
})
export class EditCinemaComponent implements OnInit, OnDestroy {
  currentCinema: Cinema;
  @ViewChild('cinemaEditForm') cinemaEditForm: NgForm;
  statuses: boolean[] = [true, false];
  noCinema: boolean = false;
  isLoading: boolean = false;
  error: string = null;
  success: string = null;

  constructor(private cimenaService: CinemaService) {}

  ngOnInit(): void {
    this.currentCinema = JSON.parse(localStorage.getItem('cinemaToEditData'));
    console.log(this.currentCinema);

    if (!this.currentCinema) {
      this.noCinema = true;
      return;
    }
  }

  onEditCinema() {
    console.log(this.cinemaEditForm.value);
    if (this.cinemaEditForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.cimenaService
      .editCinema(
        this.currentCinema._id,
        this.cinemaEditForm.value.name,
        this.cinemaEditForm.value.code,
        this.cinemaEditForm.value.startDate,
        this.cinemaEditForm.value.endDate,
        this.cinemaEditForm.value.active
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.isLoading = false;
          this.error = null;
          this.success = 'You successfully edited the Cinema hall!';

          const cinema: Cinema = {
            _id: this.currentCinema._id,
            name: this.cinemaEditForm.value.name,
            photo: 'somephoto.jpg',
            code: this.cinemaEditForm.value.code,
            seatsLayout: this.currentCinema.seatsLayout,
            seatsAvailable: this.currentCinema.seatsAvailable,
            startDate: this.cinemaEditForm.value.startDate,
            endDate: this.cinemaEditForm.value.endDate,
            active: this.cinemaEditForm.value.active,
          };

          localStorage.setItem('cinemaToEditData', JSON.stringify(cinema));
        },
        (errorResponse) => {
          this.isLoading = false;
          if (errorResponse?.error?.message) {
            console.log(errorResponse.error.message);
            this.showErrorMessage(errorResponse);
          } else {
            this.error = 'Uknown error, please try again later.';
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

  ngOnDestroy(): void {
    localStorage.removeItem('cinemaToEditData');
  }
}
