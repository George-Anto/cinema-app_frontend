import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  url: string = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  createCinema(
    name: string,
    //photo: string,
    code: number,
    //seatsLayout: number,
    startDate: Date,
    endDate: Date,
    longitude: number,
    latitude: number,
    active: boolean
  ) {
    return this.http.post<any>(`${this.url}/cinemas`, {
      name: name,
      photo: 'somephoto.jpg',
      code: code,
      seatsLayout: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      seatsAvailable: 80,
      startDate: startDate,
      endDate: endDate,
      location: {
        longitude: longitude,
        latitude: latitude,
      },
      active: active,
    });
  }

  getCinemas() {
    return this.http.get<any>(`${this.url}/cinemas`);
  }

  getOneCinema(cinemaId: string) {
    return this.http.get<any>(`${this.url}/cinemas/${cinemaId}`);
  }

  editCinema(
    id: string,
    name: string,
    //photo: string,
    code: number,
    //seatsLayout: number,
    startDate: Date,
    endDate: Date,
    longitude: number,
    latitude: number,
    active: boolean
  ) {
    return this.http.patch(`${this.url}/cinemas/${id}`, {
      name: name,
      code: code,
      startDate: startDate,
      endDate: endDate,
      location: {
        longitude: longitude,
        latitude: latitude,
      },
      active: active,
    });
  }

  deleteCinema(cinemaId: string) {
    return this.http.delete(`${this.url}/cinemas/${cinemaId}`);
  }
}
