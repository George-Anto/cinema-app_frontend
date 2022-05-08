import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  url: string = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  createReservation(
    sessionId: string,
    reservedSeats: number,
    reservedSeatsLayout: number[][],
    notificationList: string[]
  ) {
    return this.http.post<any>(`${this.url}/reservations`, {
      session: sessionId,
      reservedSeats: reservedSeats,
      reservedSeatsLayout: reservedSeatsLayout,
      notificationList: notificationList,
    });
  }
}
