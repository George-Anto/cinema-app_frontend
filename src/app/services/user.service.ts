import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Address, FavoriteDays, Genres, User } from '../models/user.model';
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
    age: string,
    favoriteDays: FavoriteDays,
    genres: Genres,
    address: Address,
    hasChildren: boolean,
    colorBlind: boolean
  ) {
    const postData = {
      name,
      surname,
      username,
      email,
      mobilePhone,
      age,
      favoriteDays,
      genres,
      address,
      hasChildren,
      colorBlind,
    };

    return this.http.patch<any>(`${this.url}/users/updateMe`, postData).pipe(
      tap((responseData) => {
        const user = this.getCurrentUser(responseData);

        this.authService.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      })
    );
  }

  updateAccountImage(image: string | File) {
    const postData = new FormData();
    postData.append('photo', image);

    return this.http.patch<any>(`${this.url}/users/updateMe`, postData).pipe(
      tap((responseData) => {
        const user = this.getCurrentUser(responseData);

        this.authService.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
      })
    );
  }

  private getCurrentUser(responseData): User {
    return new User(
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
  }

  deleteAccount() {
    return this.http.delete<any>(`${this.url}/users/deleteMe`);
  }
}
