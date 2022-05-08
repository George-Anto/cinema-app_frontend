import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvitationService } from './invitation.service';

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  url: string = 'http://localhost:3000/api/v1';

  constructor(
    private http: HttpClient,
    private invitationService: InvitationService
  ) {}

  createGuest(
    name: string,
    surname: string,
    mobilePhone: number,
    email: string,
    photo: File
  ) {
    const postData = new FormData();
    postData.append('name', name);
    postData.append('surname', surname);
    postData.append('mobilePhone', mobilePhone.toString());
    postData.append('photo', photo);
    postData.append('email', email);

    return this.http.post(`${this.url}/guests`, postData);
  }

  getMyInvitations(email: string) {
    return this.invitationService.getMyInvitations(email);
  }

  checkIn(sessionId: string) {
    return this.invitationService.checkIn(sessionId);
  }
}
