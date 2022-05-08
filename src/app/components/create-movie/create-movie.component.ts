import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.css'],
})
export class CreateMovieComponent implements OnInit {
  @ViewChild('movieForm') movieForm: NgForm;
  isLoading: boolean = false;
  error: string = null;
  success: string = null;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {}

  onCreateMovie() {
    console.log(this.movieForm.value);
    if (this.movieForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.movieService
      .createMovie(
        this.movieForm.value.title,
        this.movieForm.value.year,
        this.movieForm.value.runtime,
        this.movieForm.value.released,
        this.movieForm.value.plot,
        this.movieForm.value.fullplot,
        this.movieForm.value.directors,
        this.movieForm.value.cast,
        this.movieForm.value.irating,
        this.movieForm.value.ivotes,
        this.movieForm.value.trating,
        this.movieForm.value.tvotes
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.isLoading = false;
          this.movieForm.reset();
          this.error = null;
          this.success = 'You successfully created a Movie.';
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
    if (errorResponse.error.message.includes('imdb.rating')) {
      this.error = 'IMDB rating should be between 0 and 10.';
    } else if (errorResponse.error.message.includes('tomatoes.rating')) {
      this.error = 'Tomatoes rating should be between 0 and 10.';
    } else if (errorResponse.error.message.includes('imdb.votes')) {
      this.error = 'IMDB votes must be a positive number or zero.';
    } else if (errorResponse.error.message.includes('tomatoes.votes')) {
      this.error = 'Tomatoes votes must be a positive number or zero.';
    } else {
      this.error = 'You have not entered valid data. Try again.';
    }
  }
}
