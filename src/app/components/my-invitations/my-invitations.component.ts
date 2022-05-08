import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { InvitationService } from 'src/app/services/invitation.service';

@Component({
  selector: 'app-my-invitations',
  templateUrl: './my-invitations.component.html',
  styleUrls: ['./my-invitations.component.css'],
})
export class MyInvitationsComponent implements OnInit {
  myInvitations: Object[] = [];
  myGuestsInvitations: Object[] = [];
  isLoading: boolean = false;
  error: string = null;
  success: string = null;

  constructor(
    private invitationService: InvitationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeInvitations();
  }

  initializeInvitations() {
    this.authService.user
      .subscribe((user) => {
        this.invitationService.getMyInvitations(user.email).subscribe(
          (responseData) => {
            console.log(responseData);
            const allInvitations = responseData.data.data;
            console.log(allInvitations);
            for (let i = 0; i < allInvitations.length; i++) {
              if (allInvitations[i].email === user.email) {
                this.myInvitations.push(allInvitations[i]);
              } else {
                this.myGuestsInvitations.push(allInvitations[i]);
              }
            }
            console.log(this.myInvitations);
            console.log(this.myGuestsInvitations);
          },
          (errorResponse) => {
            console.log(errorResponse);
          }
        );
      })
      .unsubscribe();
  }

  onCheckIn(invitation) {
    this.isLoading = true;
    this.invitationService.checkIn(invitation._id).subscribe(
      (responseData) => {
        console.log(responseData);
        this.error = null;
        this.isLoading = false;
        this.success = `Successfully checked in to the ${invitation.session.name} session!`;
      },
      (errorResponse) => {
        console.log(errorResponse);
        this.success = null;
        this.isLoading = false;
        if (errorResponse?.error?.message.includes('already happened')) {
          this.error = 'You have already checked in for this movie!';
        } else {
          this.error = 'An error occured! Please try again later.';
        }
      }
    );
  }
}
