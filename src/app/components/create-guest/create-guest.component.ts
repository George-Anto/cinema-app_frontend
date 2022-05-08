import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GuestService } from 'src/app/services/guest.service';
import { mimeType } from 'src/app/custom-validators/mime-type.validator';

@Component({
  selector: 'app-create-guest',
  templateUrl: './create-guest.component.html',
  styleUrls: ['./create-guest.component.css'],
})
export class CreateGuestComponent implements OnInit {
  createGuestForm: FormGroup;
  isLoading: boolean = false;
  success: string = null;
  error: string = null;
  imagePreview: string;

  constructor(private guestService: GuestService) {}

  ngOnInit(): void {
    this.createGuestForm = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      surname: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      mobilePhone: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
  }

  onPickImage(event: Event) {
    const imageFile = (event.target as HTMLInputElement).files[0];
    this.createGuestForm.patchValue({ image: imageFile });
    this.createGuestForm.get('image').updateValueAndValidity;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    };
    fileReader.readAsDataURL(imageFile);
  }

  onSubmit() {
    if (!this.createGuestForm.valid) return;

    this.isLoading = true;

    console.log(this.createGuestForm.value);

    this.guestService
      .createGuest(
        this.createGuestForm.value.name,
        this.createGuestForm.value.surname,
        this.createGuestForm.value.mobilePhone,
        this.createGuestForm.value.email,
        this.createGuestForm.value.image
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.isLoading = false;
          this.error = null;
          this.success =
            'You have successfully created your Guest Account! Press Check Invitations to view them.';
        },
        (errorResponse) => {
          this.isLoading = false;
          if (errorResponse?.error?.message) {
            this.showErrorMessage(errorResponse);
            console.log(errorResponse.error.message);
          } else {
            this.error = 'Uknown error, please try again later.';
          }
          this.success = null;
          console.log(errorResponse);
        }
      );
  }

  private showErrorMessage(errorResponse) {
    if (errorResponse.error.message.includes('Please provide a valid email')) {
      this.error = 'Please provide a valid email.';
    } else {
      this.error = 'You have not entered valid data. Try again.';
    }
  }
}
