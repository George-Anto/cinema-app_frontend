import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css'],
})
export class DeleteAccountComponent implements OnInit {
  confirmation: boolean = false;
  isLoading: boolean = false;
  error: string = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onDeleteAccount() {
    this.isLoading = true;

    this.userService.deleteAccount().subscribe(
      (responseData) => {
        console.log(responseData);
        this.authService.logout();
      },
      (errorResponse) => {
        this.isLoading = false;
        this.error = 'Unkown error accured. Please try again later.';
        console.log(errorResponse);
      }
    );
  }
}
