import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit, OnDestroy {
  currentUser: Subscription;
  isAdmin: boolean = false;
  hasChildren: boolean;
  hasFriends: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.user.subscribe((user) => {
      if (user?.role !== 'user') this.isAdmin = true;
      this.hasChildren = user?.hasChildren;
      this.hasFriends = !!user?.friends.length;
    });
  }

  ngOnDestroy(): void {
    this.currentUser.unsubscribe();
  }
}
