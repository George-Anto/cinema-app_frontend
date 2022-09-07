import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie.model';
import { InvitationService } from 'src/app/services/invitation.service';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-friends-recommendations',
  templateUrl: './friends-recommendations.component.html',
  styleUrls: ['./friends-recommendations.component.css'],
})
export class FriendsRecommendationsComponent implements OnInit {
  error: string = null;
  isLoading: boolean;
  familyMovies: boolean;

  friendsMovies: Movie[] = [];

  constructor(
    private movieService: MovieService,
    private invitationService: InvitationService
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies() {
    this.invitationService.getMyFriendsMovies().subscribe(
      (responseData) => {
        responseData.data.data.forEach((data) => {
          this.movieService.getOneMovie(data._id).subscribe(
            (movieResponseData) => {
              this.friendsMovies.push(movieResponseData.data.data);
            },
            (movieErrorResponseData) => {
              console.log(movieErrorResponseData);
            }
          );
        });
      },
      (errorResponse) => {
        this.showErrorMessage(errorResponse);
        console.log(errorResponse);
      }
    );
  }

  private showErrorMessage(errorResponse) {
    //Not important for now
    if (errorResponse?.message?.includes('Unknown Error')) {
      this.error = 'An error occured, please try again later.';
    } else {
      this.error = 'An error occured, please try again later.';
    }
  }
}
