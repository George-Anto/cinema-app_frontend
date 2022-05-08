import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Cinema } from 'src/app/models/cinema.model';
import { Movie } from 'src/app/models/movie.model';
import { Session } from 'src/app/models/session.model';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.css'],
})
export class EditSessionComponent implements OnInit, OnDestroy {
  currentSession: Session;
  @ViewChild('sessionEditForm') sessionEditForm: NgForm;
  noSession: boolean = false;
  isLoading: boolean = false;
  error: string = null;
  success: string = null;

  cinemas: Cinema[] = [];
  movies: Movie[] = [];

  selectedMovie: string;
  selectedCinema: string;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.currentSession = JSON.parse(localStorage.getItem('sessionToEditData'));

    if (!this.currentSession) {
      this.noSession = true;
      return;
    }

    this.selectedMovie = this.currentSession.movie._id;
    this.selectedCinema = this.currentSession.cinema._id;

    this.loadMoviesAndCinemas();
  }

  loadMoviesAndCinemas() {
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

  onEditSession() {
    if (this.sessionEditForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.sessionService
      .editSession(
        this.currentSession._id,
        this.sessionEditForm.value.code,
        this.sessionEditForm.value.name,
        this.sessionEditForm.value.startDate,
        this.sessionEditForm.value.startTime,
        this.sessionEditForm.value.movie,
        this.sessionEditForm.value.cinema
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.isLoading = false;
          this.error = null;
          this.success = 'You successfully edited the Session!';

          const session: Session = {
            _id: this.currentSession._id,
            code: this.sessionEditForm.value.code,
            name: this.sessionEditForm.value.name,
            startDate: this.sessionEditForm.value.startDate,
            startTime: this.sessionEditForm.value.startTime,
            movie: {
              _id: responseData.data.session.movie._id,
              title: responseData.data.session.movie.title,
            },
            cinema: {
              _id: responseData.data.session.cinema._id,
              name: responseData.data.session.cinema.name,
            },
          };

          localStorage.setItem('sessionToEditData', JSON.stringify(session));
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

  ngOnDestroy(): void {
    localStorage.removeItem('sessionToEditData');
  }
}
