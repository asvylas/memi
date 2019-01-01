import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private username: string;
  private profilePicturePath: string;
  private created: string;
  private favorites: string[];
  private likes: string[];
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string, username: string) {
    const authData: AuthData = {
      email: email,
      password: password,
      username: username
    };
    return this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }
  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
      username: null
    };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        username: string;
        created: string;
        profilePicturePath: string;
        favorites: string[];
        likes: string[];
      }>(BACKEND_URL + '/login', authData)
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            this.username = response.username;
            this.created = response.created;
            this.profilePicturePath = response.profilePicturePath;
            const now = new Date();
            const expiration = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(
              token,
              expiration,
              this.userId,
              this.username,
              this.created,
              this.profilePicturePath
            );
            this.router.navigate(['/']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const timeDifference =
      authInformation.expirationDate.getTime() - now.getTime();
    if (timeDifference > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.username = authInformation.username;
      this.created = authInformation.created.substring(0, 10);
      this.profilePicturePath = authInformation.profilePicturePath;
      this.isAuthenticated = true;
      this.setAuthTimer(timeDifference / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getProfileInfo() {
    return {
      username: this.username,
      profilePicturePath: this.profilePicturePath,
      userId: this.userId,
      created: this.created
    };
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearLocalStorage();
    this.userId = null;
    this.router.navigate(['/']);
  }
  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    username: string,
    created: string,
    profilePicturePath: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('created', created);
    localStorage.setItem('profilePicturePath', profilePicturePath);
  }

  private clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('created');
    localStorage.removeItem('profilePicturePath');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const created = localStorage.getItem('created');
    const profilePicturePath = localStorage.getItem('profilePicturePath');
    if (!token || !expiration) {
      return;
    } else {
      return {
        token: token,
        expirationDate: new Date(expiration),
        userId: userId,
        username: username,
        created: created,
        profilePicturePath: profilePicturePath
      };
    }
  }
}
