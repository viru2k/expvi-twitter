import { PostContent } from './../../api/model/postContent';
import { VideoPost } from './../../api/model/videoPost';
import { PicturePost } from './../../api/model/picturePost';
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post} from './../../api/model/post';
import { User } from './../../api/model/user';
import { TimelineStore } from '../../store/timeline/timeline.store';
import { CommentsComponent } from '../comments/commentst.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, CommentsComponent],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  @Input() post!: Post & { user?: User };
  openedComments: number[] = [];
  public  timelineStore = inject(TimelineStore);

  like(postId: number) {
    this.timelineStore.likePost(postId);
  }

  toggleComments(postId: number) {
    if (this.openedComments.includes(postId)) {
      this.openedComments = this.openedComments.filter(id => id !== postId);
    } else {
      this.openedComments.push(postId);
    }
  }
  isPicture(content: PostContent): content is PicturePost {
    return content.type === 'picture';
  }

  isVideo(content: PostContent): content is VideoPost {
    return content.type === 'video';
  }
}
