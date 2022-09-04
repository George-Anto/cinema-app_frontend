import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatIconModule } from '@angular/material/icon';

import { GoogleMapsModule } from '@angular/google-maps';

//---------------------------------------------
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
//---------------------------------------------

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoadingSpinnerComponent } from './components/general/loading-spinner/loading-spinner.component';
import { MenuComponent } from './components/menu/menu.component';
import { AuthInterceptorService } from 'src/app/interceptors/auth-interceptor.service';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { PasswordUpdateComponent } from './components/password-update/password-update.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { UpdateAccountComponent } from './components/update-account/update-account.component';
import { CreateMovieComponent } from './components/create-movie/create-movie.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { EditMovieComponent } from './components/edit-movie/edit-movie.component';
import { CreateCinemaComponent } from './components/create-cinema/create-cinema.component';
import { CinemaListComponent } from './components/cinema-list/cinema-list.component';
import { EditCinemaComponent } from './components/edit-cinema/edit-cinema.component';
import { CreateSessionComponent } from './components/create-session/create-session.component';
import { SessionListComponent } from './components/session-list/session-list.component';
import { EditSessionComponent } from './components/edit-session/edit-session.component';
import { BookSessionComponent } from './components/book-session/book-session.component';
import { MyInvitationsComponent } from './components/my-invitations/my-invitations.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CreateGuestComponent } from './components/create-guest/create-guest.component';
import { GuestInvitationsComponent } from './components/guest-invitations/guest-invitations.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FriendsListComponent } from './components/friends-list/friends-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LoadingSpinnerComponent,
    MenuComponent,
    ForgotPasswordComponent,
    HeaderComponent,
    PasswordUpdateComponent,
    DeleteAccountComponent,
    UpdateAccountComponent,
    CreateMovieComponent,
    MovieListComponent,
    EditMovieComponent,
    CreateCinemaComponent,
    CinemaListComponent,
    EditCinemaComponent,
    CreateSessionComponent,
    SessionListComponent,
    EditSessionComponent,
    BookSessionComponent,
    MyInvitationsComponent,
    CalendarComponent,
    CreateGuestComponent,
    GuestInvitationsComponent,
    DashboardComponent,
    FriendsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatRadioModule,
    MatSelectModule,
    MatGridListModule,
    CommonModule,
    NgbModalModule,
    GoogleMapsModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatListModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
