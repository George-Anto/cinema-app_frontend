import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genres } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  getCinemas() {
    throw new Error('Method not implemented.');
  }
  url: string = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  createMovie(
    title: string,
    year: number,
    runtime: number,
    released: Date,
    plot: string,
    fullplot: string,
    directors: string,
    cast: string,
    irating: number,
    ivotes: number,
    trating: number,
    tvotes: number,
    rating: string,
    genres: Genres,
    familyMovie: boolean,
    cultStatus: boolean
  ) {
    return this.http.post<any>(`${this.url}/movies`, {
      title,
      year,
      runtime,
      released,
      plot,
      fullplot,
      directors: directors.split(','),
      cast: cast.split(','),
      imdb: {
        rating: irating,
        votes: ivotes,
      },
      tomatoes: {
        rating: trating,
        votes: tvotes,
      },
      poster: 'www.somephoto.com',
      rating,
      genres,
      familyMovie,
      cultStatus,
    });
  }

  getMovies() {
    return this.http.get<any>(`${this.url}/movies`);
  }

  getOneMovie(movieId: string) {
    return this.http.get<any>(`${this.url}/movies/${movieId}`);
  }

  getMoviesOfFavoriteGernes(type: string) {
    if (type === 'cult') {
      return this.http.get<any>(
        `${this.url}/movies/favorite-genres-cult-movies`
      );
    }
    if (type === 'family') {
      return this.http.get<any>(`${this.url}/movies/favorite-genres-family`);
    }

    return this.http.get<any>(`${this.url}/movies/favorite-genres`);
  }

  editMovie(
    id: string,
    title: string,
    year: number,
    runtime: number,
    released: Date,
    plot: string,
    fullplot: string,
    directors: string,
    cast: string,
    irating: number,
    ivotes: number,
    trating: number,
    tvotes: number,
    rating: string,
    genres: Genres,
    familyMovie: boolean,
    cultStatus: boolean
  ) {
    return this.http.patch<any>(`${this.url}/movies/${id}`, {
      title,
      year,
      runtime,
      released,
      plot,
      fullplot,
      // directors: directors.split(','),
      // cast: cast.split(','),
      directors,
      cast,
      imdb: {
        rating: irating,
        votes: ivotes,
      },
      tomatoes: {
        rating: trating,
        votes: tvotes,
      },
      poster: 'www.somephoto.com',
      rating,
      genres,
      familyMovie,
      cultStatus,
    });
  }

  deleteMovie(movieId: string) {
    return this.http.delete(`${this.url}/movies/${movieId}`);
  }
}
