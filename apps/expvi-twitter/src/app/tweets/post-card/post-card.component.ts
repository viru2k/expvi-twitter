import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post} from './../../api/model/post';
import { User } from './../../api/model/user';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  @Input() post!: Post & { user?: User };
}
