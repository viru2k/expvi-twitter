import { Post } from '../../api/model/post';
import { User } from '../../api/model/user';
import { Comment } from '../../api/model/comment';

export interface CommentWithUser extends Comment {
  user?: User;
}

export interface PostWithExtras extends Post {
  user?: User;
  comments?: CommentWithUser[];
}
