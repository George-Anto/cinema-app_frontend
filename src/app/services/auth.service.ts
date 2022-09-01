import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  jsonToken: string;
  url: string = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient, private router: Router) {}

  signup(
    name: string,
    surname: string,
    username: string,
    email: string,
    mobilePhone: string,
    password: string,
    passwordConfirm: string,
    role: string
  ) {
    return this.http.post<any>(`${this.url}/users/signup`, {
      name: name,
      surname: surname,
      username: username,
      email: email,
      mobilePhone: mobilePhone,
      password: password,
      passwordConfirm: passwordConfirm,
      role: role,
    });
  }

  signin(username: string, password: string) {
    return this.http
      .post<any>(`${this.url}/users/login`, {
        username: username,
        password: password,
      })
      .pipe(
        tap((responseData) => {
          const user = new User(
            responseData.token,
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

          this.jsonToken = responseData.token;

          this.user.next(user);
          localStorage.setItem('userData', JSON.stringify(user));
          // console.log(this.user);
        })
      );
  }

  autologin() {
    const userData: User = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser = new User(
      userData.jsonToken,
      userData.role,
      userData.id,
      userData.name,
      userData.surname,
      userData.username,
      userData.email,
      userData.mobilePhone,
      userData.photo,
      userData.age,
      userData.isColorBlind,
      userData.favoriteDays,
      userData.genres,
      userData.address,
      userData.hasChildren
    );

    this.user.next(loadedUser);
    this.jsonToken = userData.jsonToken;
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    this.user.next(null);
  }

  forgotPassword(email: string) {
    return this.http.post<any>(`${this.url}/users/forgotPassword`, {
      email: email,
    });
  }

  resetPassword(token: string, password: string, passwordConfirm: string) {
    return this.http.patch<any>(`${this.url}/users/resetPassword/:${token}`, {
      password: password,
      passwordConfirm: passwordConfirm,
    });
  }
}
