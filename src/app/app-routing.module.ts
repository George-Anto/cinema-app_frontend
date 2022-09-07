import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth-guard';
import { MenuComponent } from './components/menu/menu.component';
import { PasswordUpdateComponent } from './components/password-update/password-update.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { UpdateAccountComponent } from './components/update-account/update-account.component';
import { CreateMovieComponent } from './components/create-movie/create-movie.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { EditMovieComponent } from './components/edit-movie/edit-movie.component';
import { AdminGuard } from './guards/admin-guard';
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
import { FavoriteDaysAndGenresComponent } from './components/personalization/favorite-days-and-genres/favorite-days-and-genres.component';
import { FavoriteDaysComponent } from './components/personalization/favorite-days/favorite-days.component';
import { FriendsRecommendationsComponent } from './components/personalization/friends-recommendations/friends-recommendations.component';
import { FavoriteGenresComponent } from './components/personalization/favorite-genres/favorite-genres.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'main-menu',
    component: MenuComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'update-password',
        component: PasswordUpdateComponent,
      },
      {
        path: 'delete-account',
        component: DeleteAccountComponent,
      },
      {
        path: 'update-account',
        component: UpdateAccountComponent,
      },
      {
        path: 'create-movie',
        component: CreateMovieComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'movie-list',
        component: MovieListComponent,
      },
      {
        path: 'edit-movie',
        component: EditMovieComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'create-cinema',
        component: CreateCinemaComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'cinema-list',
        component: CinemaListComponent,
      },
      {
        path: 'edit-cinema',
        component: EditCinemaComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'create-session',
        component: CreateSessionComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'session-list',
        component: SessionListComponent,
      },
      {
        path: 'edit-session',
        component: EditSessionComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'book-session',
        component: BookSessionComponent,
      },
      {
        path: 'my-invitations',
        component: MyInvitationsComponent,
      },
      { path: 'calendar', component: CalendarComponent },
      {
        path: 'create-guest-account',
        component: CreateGuestComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'guest-invitations',
        component: GuestInvitationsComponent,
        canActivate: [AdminGuard],
      },
      { path: 'friends-list', component: FriendsListComponent },
      {
        path: 'favorite-days-genres',
        component: FavoriteDaysAndGenresComponent,
      },
      {
        path: 'favorite-days',
        component: FavoriteDaysComponent,
      },
      {
        path: 'what-my-friends-watched',
        component: FriendsRecommendationsComponent,
      },
      {
        path: 'favorite-genres',
        component: FavoriteGenresComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
