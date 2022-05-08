import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  @ViewChild('signupForm') signupForm: NgForm;
  isLoading: boolean = false;
  error: string = null;
  success: string = null;
  roles = ['user', 'ticketAdmin', 'admin'];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.signupForm.value);

    if (!this.signupForm.valid) return;

    this.isLoading = true;

    this.authService
      .signup(
        this.signupForm.value.name,
        this.signupForm.value.surname,
        this.signupForm.value.username,
        this.signupForm.value.email,
        this.signupForm.value.mobilePhone,
        this.signupForm.value.password,
        this.signupForm.value.passwordConfirm,
        this.signupForm.value.role
      )
      .subscribe(
        (responseData) => {
          this.isLoading = false;
          this.signupForm.reset();
          this.error = null;
          this.success =
            'You have successfully signed up, you can now log in to your account!';
        },
        (errorResponse) => {
          this.isLoading = false;
          if (errorResponse.error.message) {
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
