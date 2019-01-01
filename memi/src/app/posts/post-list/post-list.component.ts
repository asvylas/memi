import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent, MatDialog } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from 'src/app/profile/profile.service';
import { SinglePostComponent } from 'src/app/singlepost/single-post.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 12;
  currentPage = 1;
  userId: string;
  pageSizeOptions = [12, 24, 50, 100];
  userIsAuthenticated = false;
  userLikes: string[];
  userFavorites: string[];

  private postsSub: Subscription;
  private authStatusSub: Subscription;
  private profileSub: Subscription;

  constructor(
    public postsService: PostsService,
    public authService: AuthService,
    public profileService: ProfileService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    // If user authed get his likes and favorites list

    if (this.userIsAuthenticated) {
      this.profileService.getUserProfile();
      this.profileSub = this.profileService
        .getProfileUpdateListener()
        .subscribe(userProfile => {
          this.userLikes = userProfile.likes;
          this.userFavorites = userProfile.favorites;
        });
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onLike(postId: string) {
    this.profileService.likePost(postId, this.userId);
  }
  onFavorite(postId: string) {
    this.profileService.favoritePost(postId, this.userId);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  openDialog(post: Post) {
    this.dialog.open(SinglePostComponent, {
      data: { post: post }
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    if (this.userIsAuthenticated) {
      this.profileSub.unsubscribe();
    }
  }
}
