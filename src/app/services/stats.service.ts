import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  url: string = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  getUserStats() {
    return this.http.get<any>(`${this.url}/invitations/user-invitation-stats`);
  }

  getInvitationsCancelled() {
    return this.http.get<any>(`${this.url}/invitations?status=cancelled`);
  }

  getInvitationsValidButNotCheckedIn() {
    return this.http.get<any>(
      `${this.url}/invitations?checkin=false&status=valid`
    );
  }
}
