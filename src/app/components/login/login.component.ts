import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('signinForm') signinForm: NgForm;
  isLoading: boolean = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    if (!this.signinForm.valid) return;

    this.isLoading = true;

    this.authService
      .signin(this.signinForm.value.username, this.signinForm.value.password)
      .subscribe(
        (responseData) => {
          this.isLoading = false;
          this.signinForm.reset();
          this.router.navigate(['/main-menu/dashboard']);
        },
        (errorResponse) => {
          this.isLoading = false;
          if (errorResponse.message.includes('Unauthorized')) {
            this.error = 'There is no user with this username and password.';
          } else {
            this.error = errorResponse.message;
          }
        }
      );
  }
}
