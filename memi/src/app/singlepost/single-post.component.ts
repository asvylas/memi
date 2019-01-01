import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Post } from '../posts/post.model';

@Component({
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { post: Post }) {}
  onNoClick() {}
}
