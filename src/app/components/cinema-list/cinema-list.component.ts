import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Cinema } from 'src/app/models/cinema.model';
import { AuthService } from 'src/app/services/auth.service';
import { CinemaService } from 'src/app/services/cinema.service';

@Component({
  selector: 'app-cinema-list',
  templateUrl: './cinema-list.component.html',
  styleUrls: ['./cinema-list.component.css'],
})
export class CinemaListComponent implements OnInit {
  cinemas: Cinema[] = [];
  error: string = null;
  isLoading: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private cinemaService: CinemaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listCinemas();
    this.isLoading = false;
    this.authService.user
      .subscribe((user) => {
        if (user.role !== 'user') this.isAdmin = true;
      })
      .unsubscribe();
  }

  listCinemas() {
    this.cinemaService.getCinemas().subscribe(
      (responseCinemaData) => {
        for (let i = 0; i < responseCinemaData.data.data.length; i++) {
          this.cinemas.push(responseCinemaData.data.data[i]);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onEditCinema(cinema: Cinema) {
    localStorage.setItem('cinemaToEditData', JSON.stringify(cinema));
    this.router.navigate(['/main-menu/edit-cinema']);
  }

  onDelete(cinemaId: string) {
    this.cinemaService.deleteCinema(cinemaId).subscribe(
      () => {
        console.log('Cinema deleted successfully!');

        //auto refresh the listing page
        setTimeout(() => {
          window.location.reload();
        }, 300);
      },
      (errorResponse) => {
        console.log(errorResponse);
        this.error = 'An arror accured, please try again later.';
      }
    );
  }
}
