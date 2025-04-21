import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimelineStore } from '../../store/timeline/timeline.store';

import { ButtonModule } from 'primeng/button';
import { PostWithExtras } from '../../store/models/post-with-extras.model';
import { CommentsComponent } from '../comments/commentst.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule,  ButtonModule, CommentsComponent],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  openedComments: number[] = [];
  public  timelineStore = inject(TimelineStore);
  public selectedPost?: PostWithExtras;
  postId = Number(this.route.snapshot.paramMap.get('id'));


  ngOnInit() {
    this.timelineStore.loadPostById(this.postId);
  this.timelineStore.selectedPost$.pipe(filter((post) => !!post)).subscribe((post) => {
        this.selectedPost = post
    })
  }


    toggleComments(postId: number) {
      if (this.openedComments.includes(postId)) {
        this.openedComments = this.openedComments.filter(id => id !== postId);
      } else {
        this.openedComments.push(postId);
      }
    }

  like(postId: number) {
    this.timelineStore.likePost(postId);
  }

  deletePost(postId: number) {
    if (confirm('Are you sure to delete this post?')) {
      this.timelineStore.deletePost(postId);
    }
  }

}
