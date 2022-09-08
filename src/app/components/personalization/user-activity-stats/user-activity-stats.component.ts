import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-user-activity-stats',
  templateUrl: './user-activity-stats.component.html',
  styleUrls: ['./user-activity-stats.component.css'],
})
export class UserActivityStatsComponent implements OnInit {
  userStats = [];
  invitationsCancelled = [];
  invitationsValidButNotCheckedIn = [];
  error: string = null;
  isLoading: boolean;
  isAdmin: boolean = false;

  constructor(
    private statsService: StatsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchData();

    this.authService.user
      .subscribe((user) => {
        if (user.role !== 'user') this.isAdmin = true;
      })
      .unsubscribe();
  }

  fetchData() {
    this.statsService.getUserStats().subscribe(
      (responseData) => {
        this.userStats = responseData.data.data;
        this.error = null;
      },
      (errorResponse) => {
        console.log(errorResponse);
        this.error = 'Unknown error, please try again later.';
      }
    );

    this.statsService.getInvitationsCancelled().subscribe(
      (responseData) => {
        this.invitationsCancelled = responseData.data.data;
        this.error = null;
      },
      (errorResponse) => {
        console.log(errorResponse);
        this.error = 'Unknown error, please try again later.';
      }
    );

    this.statsService.getInvitationsValidButNotCheckedIn().subscribe(
      (responseData) => {
        this.invitationsValidButNotCheckedIn = responseData.data.data;
        this.error = null;
      },
      (errorResponse) => {
        console.log(errorResponse);
        this.error = 'Unknown error, please try again later.';
      }
    );
  }
}
