import { Time } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CinemaService } from './cinema.service';
import { MovieService } from './movie.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  url: string = 'http://localhost:3000/api/v1';

  constructor(
    private http: HttpClient,
    private cinemaService: CinemaService,
    private movieService: MovieService
  ) {}

  createSession(
    code: number,
    name: string,
    startDate: Date,
    startTime: Time,
    movie: string,
    cinema: string
  ) {
    return this.http.post<any>(`${this.url}/sessions`, {
      code: code,
      name: name,
      startDate: startDate,
      startTime: startTime,
      movie: movie,
      cinema: cinema,
    });
  }

  getSessions() {
    return this.http.get<any>(`${this.url}/sessions`);
  }

  getOneSession(sessionId: string) {
    return this.http.get<any>(`${this.url}/sessions/${sessionId}`);
  }

  getSessionsOfFavoriteDaysAndGernes(type: string, rating: string) {
    let theRating: string = '';
    if (rating && rating !== 'all') theRating = `?rating=${rating}`;
    if (type === 'cult') {
      return this.http.get<any>(
        `${this.url}/sessions/favorite-days-and-genres-and-cult-movies${theRating}`
      );
    }
    if (type === 'family') {
      return this.http.get<any>(
        `${this.url}/sessions/favorite-days-and-genres-family${theRating}`
      );
    }
    return this.http.get<any>(
      `${this.url}/sessions/favorite-days-and-genres${theRating}`
    );
  }

  getSessionsOfFavoriteDays(type: string, rating: string) {
    let theRating: string = '';
    if (rating && rating !== 'all') theRating = `?rating=${rating}`;
    if (type === 'family') {
      return this.http.get<any>(
        `${this.url}/sessions/favorite-days-family${theRating}`
      );
    }
    return this.http.get<any>(`${this.url}/sessions/favorite-days${theRating}`);
  }

  getSessionsOfFavoriteGenres(type: string, rating: string) {
    let theRating: string = '';
    if (rating && rating !== 'all') theRating = `?rating=${rating}`;
    if (type === 'family') {
      return this.http.get<any>(
        `${this.url}/sessions/favorite-genres-family${theRating}`
      );
    }
    return this.http.get<any>(
      `${this.url}/sessions/favorite-genres${theRating}`
    );
  }

  editSession(
    id: string,
    code: number,
    name: string,
    startDate: Date,
    startTime: Time,
    movie: string,
    cinema: string
  ) {
    return this.http.patch<any>(`${this.url}/sessions/${id}`, {
      code: code,
      name: name,
      startDate: startDate,
      startTime: startTime,
      movie: movie,
      cinema: cinema,
    });
  }

  getCinemas() {
    return this.cinemaService.getCinemas();
  }

  getOneCinema(cinemaId: string) {
    return this.cinemaService.getOneCinema(cinemaId);
  }

  getMovies() {
    return this.movieService.getMovies();
  }

  getOneMovie(movieId: string) {
    return this.movieService.getOneMovie(movieId);
  }

  deleteSession(sessionId: string) {
    return this.http.delete(`${this.url}/sessions/${sessionId}`);
  }
}
