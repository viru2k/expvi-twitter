import { PostContent } from './../../api/model/postContent';
import { VideoPost } from './../../api/model/videoPost';
import { PicturePost } from './../../api/model/picturePost';
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post} from './../../api/model/post';
import { User } from './../../api/model/user';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, ButtonModule,CardModule, AvatarModule,ScrollPanelModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  private router = inject(Router);
  @Input() post!: Post & { user?: User };




  isPicture(content: PostContent): content is PicturePost {
    return content.type === 'picture';
  }

  isVideo(content: PostContent): content is VideoPost {
    return content.type === 'video';
  }

  goToDetails(postId: number) {
    this.router.navigate(['/posts', postId]);
  }

  gtoUserProfile(userId: number) {
    this.router.navigate(['/user', userId]);
  }

}
