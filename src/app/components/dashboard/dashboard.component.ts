import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { CinemaService } from 'src/app/services/cinema.service';
import { SessionService } from 'src/app/services/session.service';
import { Movie } from 'src/app/models/movie.model';
import { Cinema } from 'src/app/models/cinema.model';
import { Session } from 'src/app/models/session.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  movies: Movie[] = [];
  cinemas: Cinema[] = [];
  sessions: Session[] = [];
  error: string = null;
  isLoading: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.countMovies();
    this.countCinemas();
    this.countSessions();
  }

  countMovies() {
    this.movieService.getMovies().subscribe(
      (responseData) => {
        this.movies = responseData.results;
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
  }

  countCinemas() {
    this.cinemaService.getCinemas().subscribe(
      (responseData) => {
        this.cinemas = responseData.results;
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
  }

  countSessions() {
    this.sessionService.getSessions().subscribe(
      (responseData) => {
        this.sessions = responseData.results;
      },
      (errorResponse) => {
        console.log(errorResponse);
      }
    );
  }
}
