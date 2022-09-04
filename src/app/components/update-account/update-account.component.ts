import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { mimeType } from 'src/app/custom-validators/mime-type.validator';
import { Address, FavoriteDays, Genres, User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css'],
})
export class UpdateAccountComponent implements OnInit {
  updateAccountForm: UntypedFormGroup;
  updateImageForm: UntypedFormGroup;
  isLoading: boolean = false;
  error: string = null;
  success: string = null;
  errorImage: string = null;
  successImage: string = null;
  userData = new User(null, null, null, null, null, null, null, null);
  imgUrl: string = 'http://localhost:3000/img/users/';
  imagePreview: string;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.createForms();
    this.preFillForms();
  }

  onPickImage(event: Event) {
    const imageFile = (event.target as HTMLInputElement).files[0];
    this.updateImageForm.patchValue({ image: imageFile });
    this.updateImageForm.get('image').updateValueAndValidity;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (this.updateImageForm.get('image').valid) {
        this.imagePreview = fileReader.result as string;
      }
    };
    fileReader.readAsDataURL(imageFile);
  }

  onSubmitImage() {
    if (!this.updateImageForm.valid) return;

    this.isLoading = true;

    this.userService
      .updateAccountImage(this.updateImageForm.value.image)
      .subscribe(
        () => {
          this.isLoading = false;
          this.errorImage = null;
          this.successImage =
            "You have successfully updated your account's photo!";
        },
        (errorResponse) => {
          this.isLoading = false;
          if (errorResponse?.error?.message) {
            this.showErrorMessageImage(errorResponse);
            console.log(errorResponse.error.message);
          } else {
            this.errorImage = errorResponse.message;
          }
          this.successImage = null;
          console.log(errorResponse);
        }
      );
  }

  onSubmit() {
    if (!this.updateAccountForm.valid) return;

    this.isLoading = true;

    console.log(this.updateAccountForm.value);

    const favoriteDays: FavoriteDays = {
      monday: this.updateAccountForm.value.monday,
      tuesday: this.updateAccountForm.value.tuesday,
      wednesday: this.updateAccountForm.value.wednesday,
      thursday: this.updateAccountForm.value.thursday,
      friday: this.updateAccountForm.value.friday,
      saturday: this.updateAccountForm.value.saturday,
      sunday: this.updateAccountForm.value.sunday,
    };

    const genres: Genres = {
      Action: this.updateAccountForm.value.action,
      Comedy: this.updateAccountForm.value.comedy,
      Drama: this.updateAccountForm.value.drama,
      Fantasy: this.updateAccountForm.value.fantasy,
      Horror: this.updateAccountForm.value.horror,
      Mystery: this.updateAccountForm.value.mystery,
      Romance: this.updateAccountForm.value.romance,
      Thriller: this.updateAccountForm.value.thriller,
      Western: this.updateAccountForm.value.western,
    };

    const address: Address = {
      street: this.updateAccountForm.value.street,
      number: this.updateAccountForm.value.streetNumber,
      district: this.updateAccountForm.value.district,
      city: this.updateAccountForm.value.city,
      latitude: this.updateAccountForm.value.latitude,
      longitude: this.updateAccountForm.value.longitude,
    };

    this.userService
      .updateAccount(
        this.updateAccountForm.value.name,
        this.updateAccountForm.value.surname,
        this.updateAccountForm.value.username,
        this.updateAccountForm.value.email,
        this.updateAccountForm.value.mobilePhone,
        this.updateAccountForm.value.age,
        favoriteDays,
        genres,
        address,
        this.updateAccountForm.value.children,
        this.updateAccountForm.value.colorBlind
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

  createForms() {
    this.updateAccountForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, { validators: [Validators.required] }),
      surname: new UntypedFormControl(null, { validators: [Validators.required] }),
      username: new UntypedFormControl(
        { value: null, disabled: true },
        { validators: [Validators.required] }
      ),
      email: new UntypedFormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      mobilePhone: new UntypedFormControl(
        { value: null, disabled: true },
        { validators: [Validators.required] }
      ),
      age: new UntypedFormControl(null),
      monday: new UntypedFormControl(null),
      tuesday: new UntypedFormControl(null),
      wednesday: new UntypedFormControl(null),
      thursday: new UntypedFormControl(null),
      friday: new UntypedFormControl(null),
      saturday: new UntypedFormControl(null),
      sunday: new UntypedFormControl(null),
      action: new UntypedFormControl(null),
      comedy: new UntypedFormControl(null),
      drama: new UntypedFormControl(null),
      fantasy: new UntypedFormControl(null),
      horror: new UntypedFormControl(null),
      mystery: new UntypedFormControl(null),
      romance: new UntypedFormControl(null),
      thriller: new UntypedFormControl(null),
      western: new UntypedFormControl(null),
      street: new UntypedFormControl(null),
      streetNumber: new UntypedFormControl(null),
      district: new UntypedFormControl(null),
      city: new UntypedFormControl(null),
      latitude: new UntypedFormControl(null),
      longitude: new UntypedFormControl(null),
      children: new UntypedFormControl(null),
      colorBlind: new UntypedFormControl(null),
    });

    this.updateImageForm = new UntypedFormGroup({
      image: new UntypedFormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
  }

  preFillForms() {
    this.authService.user
      .subscribe((user) => {
        this.updateAccountForm.patchValue({
          name: user.name,
          surname: user.surname,
          username: user.username,
          email: user.email,
          mobilePhone: user.mobilePhone,
          age: user.age || null,
          monday: user.favoriteDays.monday,
          tuesday: user.favoriteDays.tuesday,
          wednesday: user.favoriteDays.wednesday,
          thursday: user.favoriteDays.thursday,
          friday: user.favoriteDays.friday,
          saturday: user.favoriteDays.saturday,
          sunday: user.favoriteDays.sunday,
          action: user.genres.Action,
          comedy: user.genres.Comedy,
          drama: user.genres.Drama,
          fantasy: user.genres.Fantasy,
          horror: user.genres.Horror,
          mystery: user.genres.Mystery,
          romance: user.genres.Romance,
          thriller: user.genres.Thriller,
          western: user.genres.Western,
          street: user.address?.street,
          streetNumber: user.address?.number,
          district: user.address?.district,
          city: user.address?.city,
          latitude: user.address?.latitude,
          longitude: user.address?.longitude,
          children: user.hasChildren,
          colorBlind: user.isColorBlind,
        });

        this.updateImageForm.patchValue({
          image: `${this.imgUrl}${user.photo}`,
        });

        this.userData.id = user.id;
        this.userData.role = user.role;
        this.userData.jsonToken = user.jsonToken;
        this.userData.name = user.name;
        this.userData.surname = user.surname;
        this.userData.username = user.username;
        this.userData.email = user.email;
        this.userData.mobilePhone = user.mobilePhone;
        this.userData.photo = `${this.imgUrl}${user.photo}`;
        this.imagePreview = `${this.imgUrl}${user.photo}`;
        this.userData.age = user.age;
        this.userData.isColorBlind = user.isColorBlind;
        this.userData.favoriteDays = user.favoriteDays;
        this.userData.genres = user.genres;
        this.userData.address = user.address;
        this.userData.hasChildren = user.hasChildren;
        this.userData.friends = user.friends;

        console.log(this.userData);
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
        'Validation failed: age: Path `age` (-1) is less than minimum allowed value (0).'
      )
    ) {
      this.error = 'Not a valid age.';
    } else {
      this.error = errorResponse.error.message;
    }
  }

  private showErrorMessageImage(errorResponse) {
    if (
      errorResponse.error.message.includes(
        'Not a valid image file! Please upload only jpg images.'
      )
    ) {
      this.errorImage =
        'Not a valid image file! Please upload only jpg images.';
    } else {
      this.errorImage = 'Upload failed, please try again later.';
    }
  }
}
