import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { Movie } from 'src/app/models/movie.model';
import { Genres } from 'src/app/models/user.model';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-adit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css'],
  providers: [
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'check-indeterminate' },
    },
  ],
})
export class EditMovieComponent implements OnInit, OnDestroy {
  currentMovie: Movie;
  @ViewChild('movieEditForm') movieEditForm: NgForm;
  noMovie: boolean = false;
  isLoading: boolean = false;
  error: string = null;
  success: string = null;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.currentMovie = JSON.parse(localStorage.getItem('movieToEditData'));

    console.log(localStorage.getItem('movieToEditData'));

    if (!this.currentMovie) {
      this.noMovie = true;
      return;
    }
  }

  onEditMovie() {
    console.log(this.movieEditForm.value);
    if (this.movieEditForm.invalid) {
      return;
    }

    this.isLoading = true;

    const genres: Genres = {
      Action: !!this.movieEditForm.value.Action,
      Comedy: !!this.movieEditForm.value.Comedy,
      Drama: !!this.movieEditForm.value.Drama,
      Fantasy: !!this.movieEditForm.value.Fantasy,
      Horror: !!this.movieEditForm.value.Horror,
      Mystery: !!this.movieEditForm.value.Mystery,
      Romance: !!this.movieEditForm.value.Romance,
      Thriller: !!this.movieEditForm.value.Thriller,
      Western: !!this.movieEditForm.value.Western,
    };

    this.movieService
      .editMovie(
        this.currentMovie._id,
        this.movieEditForm.value.title,
        this.movieEditForm.value.year,
        this.movieEditForm.value.runtime,
        this.movieEditForm.value.released,
        this.movieEditForm.value.plot,
        this.movieEditForm.value.fullplot,
        this.movieEditForm.value.directors,
        this.movieEditForm.value.cast,
        this.movieEditForm.value.irating,
        this.movieEditForm.value.ivotes,
        this.movieEditForm.value.trating,
        this.movieEditForm.value.tvotes,
        this.movieEditForm.value.rating,
        genres,
        !!this.movieEditForm.value.familyMovie,
        !!this.movieEditForm.value.cultStatus
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.isLoading = false;
          this.error = null;
          this.success = 'You successfully edited the Movie!';

          const movie: Movie = {
            _id: this.currentMovie._id,
            title: this.movieEditForm.value.title,
            year: this.movieEditForm.value.year,
            runtime: this.movieEditForm.value.runtime,
            released: this.movieEditForm.value.released,
            plot: this.movieEditForm.value.plot,
            fullplot: this.movieEditForm.value.fullplot,
            directors: this.movieEditForm.value.directors,
            cast: this.movieEditForm.value.cast,
            imdb: {
              rating: this.movieEditForm.value.irating,
              votes: this.movieEditForm.value.ivotes,
            },
            tomatoes: {
              rating: this.movieEditForm.value.trating,
              votes: this.movieEditForm.value.tvotes,
            },
            posters: 'www.somephoto.com',
            rating: this.movieEditForm.value.rating,
            genres: genres,
            familyMovie: !!this.movieEditForm.value.familyMovie,
            cultStatus: !!this.movieEditForm.value.cultStatus,
          };

          localStorage.setItem('movieToEditData', JSON.stringify(movie));
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

  ngOnDestroy(): void {
    localStorage.removeItem('movieToEditData');
  }
}
