import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from 'src/app/models/movie.model';
import { AuthService } from 'src/app/services/auth.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  error: string = null;
  isLoading: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listMovies();
    this.isLoading = false;
    this.authService.user
      .subscribe((user) => {
        if (user.role !== 'user') this.isAdmin = true;
      })
      .unsubscribe();
  }

  listMovies() {
    this.movieService.getMovies().subscribe(
      (responseData) => {
        for (let i = 0; i < responseData.data.data.length; i++) {
          this.movies.push(responseData.data.data[i]);
        }
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
  }

  onEditMovie(movie: Movie) {
    localStorage.setItem('movieToEditData', JSON.stringify(movie));
    this.router.navigate(['/main-menu/edit-movie']);
  }

  onDeleteMovie(movieId: string) {
    this.movieService.deleteMovie(movieId).subscribe(
      () => {
        console.log('Movie deleted successfully!');

        //auto refresh the listing page
        setTimeout(() => {
          window.location.reload();
        }, 300);
      },
      (errorResponse) => {
        console.log(errorResponse);
        this.error = 'An arror accured, please try again later.';
      }
    );
  }
}
