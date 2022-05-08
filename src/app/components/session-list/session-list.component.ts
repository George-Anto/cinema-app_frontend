import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from 'src/app/models/session.model';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css'],
})
export class SessionListComponent implements OnInit {
  sessions: Session[] = [];
  error: string = null;
  isLoading: boolean = true;
  isAdmin: boolean = false;

  constructor(
    public sessionService: SessionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listSessions();
    this.isLoading = false;
    this.authService.user
      .subscribe((user) => {
        if (user.role !== 'user') this.isAdmin = true;
      })
      .unsubscribe();
  }

  listSessions() {
    this.sessionService.getSessions().subscribe(
      (responseSessionData) => {
        console.log(responseSessionData.data.data);
        for (let i = 0; i < responseSessionData.data.data.length; i++) {
          this.sessions.push(responseSessionData.data.data[i]);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onEditSession(session: Session) {
    localStorage.setItem('sessionToEditData', JSON.stringify(session));
    this.router.navigate(['/main-menu/edit-session']);
  }

  onBookSession(session: Session) {
    localStorage.setItem('sessionToBookData', JSON.stringify(session));
    this.router.navigate(['/main-menu/book-session']);
  }

  onDelete(id: string) {
    this.sessionService.deleteSession(id).subscribe(
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
