import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from 'src/app/models/session.model';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-favorite-days-and-genres',
  templateUrl: './favorite-days-and-genres.component.html',
  styleUrls: ['./favorite-days-and-genres.component.css'],
})
export class FavoriteDaysAndGenresComponent implements OnInit {
  mySessions = [];
  error: string = null;
  isLoading: boolean;
  isAdmin: boolean = false;

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getMySessions();
    this.isLoading = false;

    this.authService.user
      .subscribe((user) => {
        if (user.role !== 'user') this.isAdmin = true;
      })
      .unsubscribe();
  }

  getMySessions() {
    this.sessionService.getSessionsOfFavoriteDaysAndGernes().subscribe(
      (responseData) => {
        this.mySessions = responseData.data.data;
        console.log(this.mySessions);
        console.log(this.mySessions[0]);
        console.log(this.mySessions[0]?.movie_doc);
        console.log(this.mySessions[0]?.movie_doc[0]);
        console.log(this.mySessions[0]?.movie_doc[0].title);
      },
      (errorResponse) => {
        console.log(errorResponse);
        console.log(errorResponse.message);
        this.showErrorMessage(errorResponse);
      }
    );
  }

  onBookSession(session) {
    const sessionToSave: Session = {
      _id: session._id,
      code: session.code,
      name: session.name,
      startDate: session.startDate,
      startTime: session.startTime,
      movie: {
        _id: session.movie_doc[0]._id,
        title: session.movie_doc[0]._id,
      },
      cinema: {
        _id: session.cinema_doc[0]._id,
        name: session.cinema_doc[0].name,
      },
    };

    localStorage.setItem('sessionToBookData', JSON.stringify(sessionToSave));
    this.router.navigate(['/main-menu/book-session']);
  }

  private showErrorMessage(errorResponse) {
    //Not important for now
    if (errorResponse.error?.message?.includes('enddate')) {
      this.error = 'The end date must be greater than the start date.';
    } else if (errorResponse?.message.includes('Unknown Error')) {
      this.error = 'An error occured, please try again later.';
    }
  }
}
