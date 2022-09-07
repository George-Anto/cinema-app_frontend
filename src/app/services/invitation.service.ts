import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  url: string = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  getMyInvitations(myEmail: string) {
    return this.http.get<any>(
      `${this.url}/invitations?checkin=false&email=${myEmail}`
    );
  }

  checkIn(sessionId: string) {
    return this.http.patch<any>(
      `${this.url}/invitations/checkin/${sessionId}`,
      {}
    );
  }

  getMyFriendsMovies() {
    return this.http.get<any>(`${this.url}/invitations/your-friends-watched`);
  }
}
