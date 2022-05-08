import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.css'],
})
export class PasswordUpdateComponent implements OnInit {
  @ViewChild('updatePassForm') updatePassForm: NgForm;
  isLoading: boolean = false;
  error: string = null;
  success: string = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    if (!this.updatePassForm.valid) return;

    this.isLoading = true;

    this.userService
      .updatePassword(
        this.updatePassForm.value.passwordCurrent,
        this.updatePassForm.value.password,
        this.updatePassForm.value.passwordConfirm
      )
      .subscribe(
        (responseData) => {
          this.isLoading = false;
          this.updatePassForm.reset();
          this.error = null;
          if (responseData?.status == 'success') {
            this.success =
              'You have successfully updated your password! You will now be redirected to login screen.';
            setTimeout(() => {
              this.authService.logout();
            }, 3000);
          }
        },
        (errorResponse) => {
          this.isLoading = false;
          if (errorResponse?.message.includes('Unauthorized')) {
            this.error = errorResponse.error.message;
          } else if (
            errorResponse?.error?.message.includes('shorter than the minimum')
          ) {
            this.error = 'The new password must be at least 8 characters long.';
          } else {
            this.error = errorResponse.message;
          }
          console.log(errorResponse);
          this.success = null;
        }
      );
  }
}
