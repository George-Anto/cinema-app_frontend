import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css'],
})
export class FriendsListComponent implements OnInit {
  // findFriendsForm: UntypedFormGroup;
  findFriendsForm: FormGroup;
  isLoading: boolean = false;
  error: string = null;
  success: string = null;
  userData = new User(null, null, null, null, null, null, null, null);
  friends: User[] = new Array();

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.showFriends();
  }

  private createForm(): void {
    this.findFriendsForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  showFriends() {
    this.authService.user
      .subscribe((user) => {
        this.userData.friends = user.friends;
        console.log(this.userData.friends);

        this.userData.friends.forEach((id) => {
          this.userService.getUserById(id).subscribe((aUser) => {
            this.friends.push(aUser.data.data);
          });
        });
        console.log(this.friends);
      })
      .unsubscribe();
  }

  onSubmit(): void {
    if (!this.findFriendsForm.valid) return;

    this.isLoading = true;

    console.log(this.findFriendsForm.value);

    this.userService.getUserByEmail(this.findFriendsForm.value.email).subscribe(
      (aUserData) => {
        const theUser = aUserData.data.data;

        console.log(theUser);
        console.log(this.userData.friends);

        if (this.userData.friends.includes(theUser._id)) {
          this.isLoading = false;
          this.success = null;
          this.error = 'You hava already that person in your friends list!';
          return;
        }

        this.friends.push(theUser);
        this.userData.friends.push(theUser._id);

        this.userService.updateAccountFriends(this.userData.friends).subscribe(
          () => {
            this.isLoading = false;
            this.error = null;
            this.success =
              'You have successfully added a new friend to your account!';
          },
          (errorResponse) => {
            this.isLoading = false;
            if (errorResponse?.error?.message) {
              // this.showErrorMessage(errorResponse);
              this.error = errorResponse.error.message;
              console.log(errorResponse.error.message);
            } else {
              this.error = errorResponse.message;
            }
            this.success = null;
            console.log(errorResponse);
          }
        );
      },
      (errorResponse) => {
        this.isLoading = false;
        this.showErrorMessage(errorResponse);
      }
    );
  }

  private showErrorMessage(errorResponse) {
    if (
      errorResponse?.error?.message.includes(
        'No document found with that ID or that Email'
      )
    ) {
      this.error = 'No user with that email was found.';
      console.log(errorResponse);
    } else {
      this.error = 'An error occured, please try again later.';
      console.log(errorResponse);
    }
  }
}
