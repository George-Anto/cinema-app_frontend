import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Session } from 'src/app/models/session.model';
import { AuthService } from 'src/app/services/auth.service';
import { CalculateDistanceService } from 'src/app/services/calculate-distance.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-favorite-days',
  templateUrl: './favorite-days.component.html',
  styleUrls: ['./favorite-days.component.css'],
})
export class FavoriteDaysComponent implements OnInit {
  @ViewChild('ratingForm') ratingForm: NgForm;
  @ViewChild('distanceForm') distanceForm: NgForm;
  mySessions = [];
  isThereAnError: boolean = false;
  error: string = null;
  isLoading: boolean;
  isAdmin: boolean = false;
  familyMovies: boolean;
  type: string;
  usersLatitude: number;
  usersLongitude: number;
  isAddressPresent: boolean = false;

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private distanceService: CalculateDistanceService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.familyMovies = !!params.familyMovies;

      this.type = 'all';
      if (this.familyMovies) this.type = 'family';

      this.isLoading = true;
      this.getMySessions(!!this.distanceForm?.value?.distance);
      this.isLoading = false;
    });
    this.authService.user
      .subscribe((user) => {
        if (user.role !== 'user') this.isAdmin = true;
        this.usersLatitude = user?.address?.latitude;
        this.usersLongitude = user?.address?.longitude;

        if (this.usersLatitude && this.usersLongitude)
          this.isAddressPresent = true;
      })
      .unsubscribe();
  }

  getMySessions(deleteDistantCinemas?: boolean) {
    this.sessionService
      .getSessionsOfFavoriteDays(this.type, this.ratingForm?.value?.rating)
      .subscribe(
        (responseData) => {
          this.mySessions = responseData.data.data;
          // console.log(this.mySessions);
          // console.log(this.mySessions[0]);
          // console.log(this.mySessions[0]?.movie_doc);
          // console.log(this.mySessions[0]?.movie_doc[0]);
          // console.log(this.mySessions[0]?.movie_doc[0].title);

          if (deleteDistantCinemas) this.deleteDistantCinemas();
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
    this.getMySessions(!!this.distanceForm?.value?.distance);
    this.isLoading = false;
  }

  onSendDistance() {
    if (!this.isAddressPresent) return;

    this.isLoading = true;
    this.getMySessions(true);
    this.isLoading = false;
  }

  deleteDistantCinemas() {
    if (this.distanceForm.value === 'all') return;

    for (let i = 0; i < this.mySessions.length; i++) {
      const cinemaLat = this.mySessions[i].cinema_doc[0].location.latitude;
      const cinemaLong = this.mySessions[i].cinema_doc[0].location.longitude;

      const distance = this.distanceService.calcDistance(
        this.usersLatitude,
        this.usersLongitude,
        cinemaLat,
        cinemaLong
      );

      if (distance > this.distanceForm.value.distance) {
        this.mySessions.splice(i, 1);
        i--;
      }
    }
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
