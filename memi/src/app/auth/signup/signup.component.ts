import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStateSub: Subscription;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStateSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.isLoading = true;
      const e = this.authService.createUser(
        form.value.email,
        form.value.password,
        form.value.username
      );
    }
  }
  ngOnDestroy(): void {
    this.authStateSub.unsubscribe();
  }
}
