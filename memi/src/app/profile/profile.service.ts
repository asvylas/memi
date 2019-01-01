import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { UserProfileModel } from './user-profile.model';

import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
const BACKEND_URL = environment.apiUrl + '/profile/';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
  private userData = new Subject<UserProfileModel>();
  userId: string;

  getUserProfile() {
    this.http
      .get<{ userProfile: UserProfileModel }>(
        BACKEND_URL + this.authService.getUserId()
      )
      .subscribe(
        response => {
          this.userData.next(response.userProfile);
        },
        error => {
          this.router.navigate(['/']);
        }
      );
  }

  likePost(postId: string, userId: string) {
    this.http
      .post<{ message: string; userProfile: UserProfileModel }>(
        BACKEND_URL + 'like',
        {
          postId,
          userId
        }
      )
      .subscribe(
        response => {
          console.log(response);
          this.userData.next(response.userProfile);
        },
        error => {}
      );
  }

  favoritePost(postId: string, userId: string) {
    this.http
      .post<{ message: string; userProfile: UserProfileModel }>(
        BACKEND_URL + 'favorite',
        {
          postId,
          userId
        }
      )
      .subscribe(
        response => {
          console.log(response);
          this.userData.next(response.userProfile);
        },
        error => {}
      );
  }

  getProfileUpdateListener() {
    return this.userData.asObservable();
  }
}
