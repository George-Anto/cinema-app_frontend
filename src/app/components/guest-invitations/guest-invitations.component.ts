import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-guest-invitations',
  templateUrl: './guest-invitations.component.html',
  styleUrls: ['./guest-invitations.component.css'],
})
export class GuestInvitationsComponent implements OnInit {
  @ViewChild('checkInvitationsForm') checkInvitationsForm: NgForm;
  myInvitations: Object[] = [];
  buttonPressed: boolean = false;
  isLoading: boolean = false;
  success: string = null;
  error: string = null;

  constructor(private guestService: GuestService) {}

  ngOnInit(): void {}

  onSubmit() {
    if (!this.checkInvitationsForm.valid) return;

    this.isLoading = true;
    this.buttonPressed = true;

    console.log(this.checkInvitationsForm.value);

    this.guestService
      .getMyInvitations(this.checkInvitationsForm.value.email)
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.isLoading = false;
          this.error = null;
          this.myInvitations = responseData.data.data;
          console.log(this.myInvitations);
        },
        (errorResponse) => {
          this.isLoading = false;
          if (errorResponse?.error?.message) {
            this.showErrorMessage(errorResponse);
            console.log(errorResponse.error.message);
          } else {
            this.error = errorResponse.message;
          }
          this.success = null;
          console.log(errorResponse);
        }
      );
  }

  onCheckIn(invitation) {
    this.isLoading = true;
    this.guestService.checkIn(invitation._id).subscribe(
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

  private showErrorMessage(errorResponse) {
    if (errorResponse.error.message.includes('username')) {
      this.error = 'There is another user with that username already.';
    } else if (errorResponse.error.message.includes('email')) {
      this.error = 'There is another user with that email already.';
    } else if (errorResponse.error.message.includes('mobilePhone')) {
      this.error =
        'There is another user with that mobile phone already or the mobile phone you provided is not valid.';
    } else if (errorResponse.error.message.includes('passwordConfirm')) {
      this.error = 'Password and confirm password inputs are not the same.';
    } else if (errorResponse.error.message.includes('password')) {
      this.error = 'The password must be at least 8 characters long.';
    }
  }
}
