import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    tvotes: number
  ) {
    return this.http.post<any>(`${this.url}/movies`, {
      title: title,
      year: year,
      runtime: runtime,
      released: released,
      plot: plot,
      fullplot: fullplot,
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
    });
  }

  getMovies() {
    return this.http.get<any>(`${this.url}/movies`);
  }

  getOneMovie(movieId: string) {
    return this.http.get<any>(`${this.url}/movies/${movieId}`);
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
    tvotes: number
  ) {
    return this.http.patch<any>(`${this.url}/movies/${id}`, {
      title: title,
      year: year,
      runtime: runtime,
      released: released,
      plot: plot,
      fullplot: fullplot,
      directors: directors,
      cast: cast,
      imdb: {
        rating: irating,
        votes: ivotes,
      },
      tomatoes: {
        rating: trating,
        votes: tvotes,
      },
      poster: 'www.somephoto.com',
    });
  }

  deleteMovie(movieId: string) {
    return this.http.delete(`${this.url}/movies/${movieId}`);
  }
}
