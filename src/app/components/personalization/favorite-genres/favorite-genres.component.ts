import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from 'src/app/models/session.model';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-favorite-genres',
  templateUrl: './favorite-genres.component.html',
  styleUrls: ['./favorite-genres.component.css'],
})
export class FavoriteGenresComponent implements OnInit {
  @ViewChild('ratingForm') ratingForm: NgForm;
  mySessions = [];
  isThereAnError: boolean = false;
  error: string = null;
  isLoading: boolean;
  isAdmin: boolean = false;
  familyMovies: boolean;
  type: string;

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.familyMovies = !!params.familyMovies;

      this.type = 'all';
      if (this.familyMovies) this.type = 'family';

      this.isLoading = true;
      this.getMySessions(this.type);
      this.isLoading = false;
    });
    this.authService.user
      .subscribe((user) => {
        if (user.role !== 'user') this.isAdmin = true;
      })
      .unsubscribe();
  }

  getMySessions(type: string) {
    this.sessionService
      .getSessionsOfFavoriteGenres(this.type, this.ratingForm?.value?.rating)
      .subscribe(
        (responseData) => {
          this.mySessions = responseData.data.data;
          console.log(this.mySessions);
          // console.log(this.mySessions[0]);
          // console.log(this.mySessions[0]?.movie_doc);
          // console.log(this.mySessions[0]?.movie_doc[0]);
          // console.log(this.mySessions[0]?.movie_doc[0].title);
        },
        (errorResponse) => {
          console.log(errorResponse);
          console.log(errorResponse.message);
          this.showErrorMessage(errorResponse);
        }
      );
  }

  onSendRating() {
    this.isLoading = true;
    this.getMySessions(this.type);
    this.isLoading = false;
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
    } else {
      this.isThereAnError = true;
    }
  }
}
