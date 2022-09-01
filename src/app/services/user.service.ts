import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { FavoriteDays, Genres, User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient, private authService: AuthService) {}

  updatePassword(
    passwordCurrent: string,
    password: string,
    passwordConfirm: string
  ) {
    return this.http.patch<any>(`${this.url}/users/updateMyPassword`, {
      passwordCurrent: passwordCurrent,
      password: password,
      passwordConfirm: passwordConfirm,
    });
  }

  updateAccount(
    name: string,
    surname: string,
    username: string,
    email: string,
    mobilePhone: string,
    image: string | File,
    age: string,
    favoriteDays: FavoriteDays,
    genres: Genres
  ) {
    let postData;

    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('name', name);
      postData.append('surname', surname);
      postData.append('username', username);
      postData.append('email', email);
      postData.append('mobilePhone', mobilePhone);
      postData.append('photo', image);
      postData.append('age', age);
      // postData.append('favoriteDays.monday', favoriteDays.monday);
      // postData.append('favoriteDays.tuesday', favoriteDays.tuesday);
      // postData.append('favoriteDays.wednesday', favoriteDays.wednesday);
      // postData.append('favoriteDays.thursday', favoriteDays.thursday);
      // postData.append('favoriteDays.friday', favoriteDays.friday);
      // postData.append('favoriteDays.saturday', favoriteDays.saturday);
      // postData.append('favoriteDays.sunday', favoriteDays.sunday);
    } else {
      postData = {
        name,
        surname,
        username,
        email,
        mobilePhone,
        photo: image,
        age,
        favoriteDays,
        genres,
      };
    }

    return this.http.patch<any>(`${this.url}/users/updateMe`, postData).pipe(
      tap((responseData) => {
        const user = new User(
          this.authService.jsonToken,
          responseData.data.user.role,
          responseData.data.user._id,
          responseData.data.user.name,
          responseData.data.user.surname,
          responseData.data.user.username,
          responseData.data.user.email,
          responseData.data.user.mobilePhone,
          responseData.data.user.photo,
          responseData.data.user.age,
          responseData.data.user.colorBlind,
          responseData.data.user.favoriteDays,
          responseData.data.user.genres,
          responseData.data.user.address,
          responseData.data.user.hasChildren
        );

        this.authService.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      })
    );
  }

  deleteAccount() {
    return this.http.delete<any>(`${this.url}/users/deleteMe`);
  }
}
