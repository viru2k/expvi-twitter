import { Comment } from './../../api/model/comment';
import { Post } from './../../api/model/post';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { User } from '../../api/model/user';
import { PostsService } from '../../api/api/posts.service';
import { UsersService } from '../../api/api/users.service';
import { CommentsService } from '../../api/api/comments.service';
import { tap, catchError, EMPTY, forkJoin, exhaustMap } from 'rxjs';

interface UserProfileState {
  user?: User;
  posts: Post[];
  likes: Post[];
  comments?: Comment[];
  isLoading: boolean;
}

const DEFAULT_STATE: UserProfileState = {
  user: undefined,
  posts: [],
  likes: [],
  comments: [],
  isLoading: false
};

@Injectable({ providedIn: 'root' })
export class UserProfileStore extends ComponentStore<UserProfileState> {
  constructor(private postService: PostsService, private usersService: UsersService, private commentsService:CommentsService) {
    super(DEFAULT_STATE);
  }

  readonly user$ = this.select((s) => s.user);
  readonly posts$ = this.select((s) => s.posts);
  readonly likes$ = this.select((s) => s.likes);
  readonly comments$ = this.select((s) => s.comments);
  readonly isLoading$ = this.select((s) => s.isLoading);

  readonly setLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    isLoading
  }));

  readonly setUserData = this.updater((state, user: User) => ({
    ...state,
    ...user
  }));

  readonly setPostData = this.updater((state,  posts: Post[]) => ({
    ...state,
   posts
  }));
  readonly setLikesData = this.updater((state,  likes: Post[]) => ({
    ...state,
    likes
  }));

  readonly setCommentsData = this.updater((state,  comments: Comment[]) => ({
    ...state,
    comments
  }));
  readonly loadUserProfile = this.effect<number>((userId$) =>
    userId$.pipe(
      tap(() => this.setLoading(true)),
      exhaustMap((userId) =>
        forkJoin({
          user: this.usersService.getUserById(userId),
          posts: this.usersService.getUserPosts(userId),
          likes: this.postService.getPostLikes(userId),
          comments: this.usersService.getUserComments(userId)
        }).pipe(
          tap(({ user, posts, likes, comments }) => {
            this.setUserData(user.data ?? { id: 0, name: '', email: '' });
            this.setPostData(posts.data ?? []);
            this.setLikesData(likes.data ?? []);
            this.setCommentsData(comments.data ?? []);
          }),
          catchError((err) => {
            console.error('Error al cargar perfil de usuario', err);
            return EMPTY;
          }),
          tap(() => this.setLoading(false))
        )
      )
    )
  );


}
