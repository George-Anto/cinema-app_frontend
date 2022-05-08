import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('forgotPassForm') forgotPassForm: NgForm;

  @ViewChild('resetPassForm') resetPassForm: NgForm;

  forgotIsLoading: boolean = false;
  forgotError: string = null;
  forgotSuccess: string = null;

  resetIsLoading: boolean = false;
  resetError: string = null;
  resetSuccess: string = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmitForgotPass() {
    if (!this.forgotPassForm.valid) return;

    this.forgotIsLoading = true;

    this.authService.forgotPassword(this.forgotPassForm.value.email).subscribe(
      (responseData) => {
        this.forgotIsLoading = false;
        this.forgotPassForm.reset();
        this.forgotError = null;
        if (responseData?.status == 'success')
          this.forgotSuccess = responseData.message;
      },
      (errorResponse) => {
        console.log(errorResponse);
        this.forgotIsLoading = false;
        this.forgotSuccess = null;
        if (errorResponse?.error?.error?.statusCode == 404) {
          this.forgotError = 'There is no registered user with that email.';
        } else {
          this.forgotError = 'Uknown error occured. Please try again later.';
        }
      }
    );
  }

  onSubmitResetPass() {
    if (!this.resetPassForm.valid) return;

    this.resetIsLoading = true;

    this.authService
      .resetPassword(
        this.resetPassForm.value.token,
        this.resetPassForm.value.password,
        this.resetPassForm.value.passwordConfirm
      )
      .subscribe(
        (responseData) => {
          this.resetIsLoading = false;
          this.resetPassForm.reset();
          this.resetError = null;
          if (responseData?.status == 'success')
            this.forgotSuccess =
              'You have successfully changed your password. You can now log in with your new credentials.';
        },
        (errorResponse) => {
          console.log(errorResponse);
          this.resetIsLoading = false;
          this.resetSuccess = null;
          if (errorResponse?.error?.error?.statusCode == 400) {
            this.resetError = errorResponse.error.message;
          } else {
            this.resetError = 'Uknown error occured. Please try again later.';
          }
        }
      );
  }
}
