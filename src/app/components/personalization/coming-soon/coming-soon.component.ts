import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from 'src/app/models/movie.model';
import { Session } from 'src/app/models/session.model';
import { AuthService } from 'src/app/services/auth.service';
import { MovieService } from 'src/app/services/movie.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css'],
})
export class ComingSoonComponent implements OnInit {
  comingSoonMovies: Movie[] = [];
  error: string = null;
  isLoading: boolean;
  isAdmin: boolean = false;
  cultMovies: boolean;
  familyMovies: boolean;
  isThereAnError: boolean = false;

  constructor(
    private sessionService: SessionService,
    private movieService: MovieService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.cultMovies = !!params.cultMovies;
      this.familyMovies = !!params.familyMovies;

      let type: string = 'all';
      if (this.cultMovies) type = 'cult';
      if (this.familyMovies) type = 'family';

      this.isLoading = true;
      this.loadComingSoonMovies(type);
      this.isLoading = false;
    });
    this.authService.user
      .subscribe((user) => {
        if (user.role !== 'user') this.isAdmin = true;
      })
      .unsubscribe();
  }

  loadComingSoonMovies(type: string) {
    this.sessionService.getSessions().subscribe(
      (responseData) => {
        const allSessions: Session[] = responseData.data.data;
        console.log(allSessions);
        this.movieService.getMoviesOfFavoriteGernes(type).subscribe(
          (responseMovieData) => {
            this.comingSoonMovies = responseMovieData.data.data;
            console.log(this.comingSoonMovies);

            for (let i = 0; i < this.comingSoonMovies.length; i++) {
              const currentId = this.comingSoonMovies[i]._id;

              let isIdPressent = false;

              allSessions.forEach((session) => {
                if (session.movie._id === currentId) isIdPressent = true;
              });

              if (isIdPressent) {
                this.comingSoonMovies.splice(i, 1);
                i--;
              }
            }
          },
          (errorMovieData) => {
            console.log(errorMovieData);
            console.log(errorMovieData?.message);
            this.isThereAnError = true;
          }
        );
      },
      (errorData) => {
        console.log(errorData);
        console.log(errorData?.message);
        this.showErrorMessage(errorData);
      }
    );
  }

  private showErrorMessage(errorResponse) {
    //Not important for now
    if (errorResponse.error?.message?.includes('enddate')) {
      this.error = 'The end date must be greater than the start date.';
    } else if (errorResponse?.message.includes('Unknown Error')) {
      this.error = 'An error occured, please try again later.';
    } else {
      this.isThereAnError = true;
    }
  }
}
