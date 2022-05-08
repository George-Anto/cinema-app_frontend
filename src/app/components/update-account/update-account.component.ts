import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mimeType } from 'src/app/custom-validators/mime-type.validator';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css'],
})
export class UpdateAccountComponent implements OnInit {
  updateAccountForm: FormGroup;
  isLoading: boolean = false;
  error: string = null;
  success: string = null;
  userData = new User(null, null, null, null, null, null, null, null);
  imgUrl: string = 'http://localhost:3000/img/users/';
  imagePreview: string;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.preFillForm();
  }

  onPickImage(event: Event) {
    const imageFile = (event.target as HTMLInputElement).files[0];
    this.updateAccountForm.patchValue({ image: imageFile });
    this.updateAccountForm.get('image').updateValueAndValidity;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (this.updateAccountForm.get('image').valid) {
        this.imagePreview = fileReader.result as string;
      }
    };
    fileReader.readAsDataURL(imageFile);
  }

  onSubmit() {
    if (!this.updateAccountForm.valid) return;

    this.isLoading = true;

    this.userService
      .updateAccount(
        this.updateAccountForm.value.name,
        this.updateAccountForm.value.surname,
        this.updateAccountForm.value.username,
        this.updateAccountForm.value.email,
        this.updateAccountForm.value.mobilePhone,
        this.updateAccountForm.value.image
      )
      .subscribe(
        () => {
          this.isLoading = false;
          this.error = null;
          this.success =
            "You have successfully updated your account's information!";
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

  createForm() {
    this.updateAccountForm = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      surname: new FormControl(null, { validators: [Validators.required] }),
      username: new FormControl(
        { value: null, disabled: true },
        { validators: [Validators.required] }
      ),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      mobilePhone: new FormControl(
        { value: null, disabled: true },
        { validators: [Validators.required] }
      ),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
  }

  preFillForm() {
    this.authService.user
      .subscribe((user) => {
        this.updateAccountForm.patchValue({
          name: user.name,
          surname: user.surname,
          username: user.username,
          email: user.email,
          mobilePhone: user.mobilePhone,
          image: `${this.imgUrl}${user.photo}`,
        });

        this.userData.name = user.name;
        this.userData.surname = user.surname;
        this.userData.username = user.username;
        this.userData.email = user.email;
        this.userData.mobilePhone = user.mobilePhone;
        this.userData.photo = `${this.imgUrl}${user.photo}`;
        this.imagePreview = `${this.imgUrl}${user.photo}`;
      })
      .unsubscribe();
  }

  private showErrorMessage(errorResponse) {
    if (errorResponse.error.message.includes('username')) {
      this.error = 'There is another user with that username already.';
    } else if (errorResponse.error.message.includes('email')) {
      this.error = 'There is another user with that email already.';
    } else if (errorResponse.error.message.includes('mobilePhone')) {
      this.error =
        'There is another user with that mobile phone already or the mobile phone you provided is not valid.';
    } else if (
      errorResponse.error.message.includes(
        'Not a valid image file! Please upload only jpg images.'
      )
    ) {
      this.error = 'Not a valid image file! Please upload only jpg images.';
    } else {
      this.error = errorResponse.error.message;
    }
  }
}
