import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../app/auth/auth.service';
import { ProfileService } from './profile.service';
import { UserProfileModel } from './user-profile.model';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  private profileListenerSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;
  userProfile: UserProfileModel;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.profileService.getUserProfile();
    this.profileListenerSubs = this.profileService
      .getProfileUpdateListener()
      .subscribe(userProfile => {
        this.userProfile = userProfile;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.profileListenerSubs.unsubscribe();
  }
}
