import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Cinema } from 'src/app/models/cinema.model';
import { Movie } from 'src/app/models/movie.model';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css'],
})
export class CreateSessionComponent implements OnInit {
  @ViewChild('sessionForm') sessionForm: NgForm;
  isLoading: boolean = false;
  error: string = null;
  success: string = null;

  cinemas: Cinema[] = [];
  movies: Movie[] = [];

  selectedMovie: string;
  selectedCinema: string;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.getCinemas().subscribe(
      (responseCinemaData) => {
        for (let i = 0; i < responseCinemaData.data.data.length; i++) {
          this.cinemas.push(responseCinemaData.data.data[i]);
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.sessionService.getMovies().subscribe(
      (responseMovieData) => {
        for (let i = 0; i < responseMovieData.data.data.length; i++) {
          this.movies.push(responseMovieData.data.data[i]);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onCreateSession() {
    if (this.sessionForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.sessionService
      .createSession(
        this.sessionForm.value.code,
        this.sessionForm.value.name,
        this.sessionForm.value.startDate,
        this.sessionForm.value.startTime,
        this.sessionForm.value.movie,
        this.sessionForm.value.cinema
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.isLoading = false;
          this.sessionForm.reset();
          this.error = null;
          this.success = 'You successfully created a Session!';
        },
        (errorResponse) => {
          this.isLoading = false;
          if (errorResponse?.error?.message) {
            this.showErrorMessage(errorResponse);
            console.log(errorResponse.error.message);
          } else {
            this.error = 'Uknown error, please try again later.';
          }
          this.success = null;
          console.log(errorResponse);
        }
      );
  }

  private showErrorMessage(errorResponse) {
    if (errorResponse.error.message.includes('code')) {
      this.error = 'You must enter a unique code.';
    } else {
      this.error = 'You have not entered valid data. Try again.';
    }
  }
}
