import { Comment } from './../../api/model/comment';

import { User } from './../../api/model/user';
import { Post } from './../../api/model/post';

import { Injectable } from '@angular/core';
import { PostsService } from './..//../api/api/posts.service';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { linkToGlobalState } from './../component-state.reducer';
 // Wrapper del API

import { tap, switchMap, catchError, EMPTY, interval, withLatestFrom, map } from 'rxjs';
import { PostWithExtras } from '../models/post-with-extras.model';

export interface TimelineState {
  posts: Array<Post & { user?: User }>;
  selectedPost?: PostWithExtras;
  isLoading: boolean;
  isPolling: boolean;
  nextCursor?: string;
  searchTerm: string;
  lastPollTs?: number;
  commentsByPostId: Record<number, Comment[]>;
}

const DEFAULT_STATE: TimelineState = {

  posts: [],
  selectedPost:{},
  isLoading: false,
  isPolling: false,
  searchTerm: '',
  commentsByPostId: {}
};

@Injectable({ providedIn: 'root' })
export class TimelineStore extends ComponentStore<TimelineState> {
  constructor(private postService: PostsService,   private globalStore: Store) {
    super(DEFAULT_STATE);
    linkToGlobalState(this.state$, 'TimelineStore', this.globalStore);
  }

  readonly posts$ = this.select((s) => s.posts);
  readonly selectedPost$ = this.select((state) => state.selectedPost);
  readonly isLoading$ = this.select((s) => s.isLoading);
  readonly searchTerm$ = this.select((s) => s.searchTerm);

  readonly setPosts = this.updater((state, posts: Post[]) => ({
    ...state,
    posts
  }));

  readonly appendPosts = this.updater((state, newPosts: Post[]) => ({
    ...state,
    posts: [...state.posts, ...newPosts]
  }));
  readonly setSelectedPost = this.updater((state, post: PostWithExtras) => ({
    ...state,
    selectedPost: post
  }));
  readonly prependPosts = this.updater((state, newPosts: Post[]) => ({
    ...state,
    posts: [...newPosts, ...state.posts]
  }));

  readonly setLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    isLoading
  }));

  readonly setSearchTerm = this.updater((state, searchTerm: string) => ({
    ...state,
    searchTerm
  }));

  readonly setNextCursor = this.updater((state, nextCursor?: string) => ({
    ...state,
    nextCursor
  }));

  readonly setLastPollTs = this.updater((state, timestamp: number) => ({
    ...state,
    lastPollTs: timestamp
  }));

  readonly setCommentsForPost = this.updater((state, { postId, comments }: { postId: number; comments: Comment[] }) => ({
    ...state,
    commentsByPostId: {
      ...state.commentsByPostId,
      [postId]: comments
    }
  }));


  readonly selectCommentsByPostId = (postId: number) =>
    this.select((s) => s.commentsByPostId[postId] ?? []);


  readonly loadTimeline = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.postService.listPosts().pipe(
          tap((res) => {
            this.setPosts(res.data ?? []);
            this.setLastPollTs(Date.now());
          }),
          catchError((err) => {
            console.error('Error en loadTimeline', err);
            return EMPTY;
          }),
          tap(() => this.setLoading(false))
        )
      )
    )
  );


  readonly loadPostById = this.effect<number>((postId$) =>
    postId$.pipe(
      switchMap((postId) =>
        this.postService.getPostById(postId).pipe(
          switchMap((postRes) =>
            this.postService.getPostUser(postId).pipe(
              switchMap((userRes) =>
                this.postService.getPostComments(postId).pipe(
                  map((commentsRes) => ({
                    ...postRes.data,
                    user: userRes.data,
                    comments: commentsRes.data ?? []
                  }))
                )
              )
            )
          ),
          tap((enrichedPost) => this.setSelectedPost(enrichedPost)),
          catchError((err) => {
            console.error('Error al cargar post por id', err);
            return EMPTY;
          })
        )
      )
    )
  );




  // 🔁 Scroll infinit
  readonly loadMore = this.effect(() =>
    this.select((s) => s.nextCursor).pipe(
      switchMap((cursor) =>
        cursor
          ? this.postService.listPosts(cursor ).pipe(
              tap((res) => {
                this.appendPosts(res.data || []);
                this.setNextCursor(res.next_cursor);

              }),
              catchError(() => EMPTY)
            )
          : EMPTY
      )
    )
  );


  readonly startPolling = this.effect(() =>
    interval(30000).pipe(
      withLatestFrom(this.select((s) => s.lastPollTs)),
      switchMap(([_, since]) =>
        since
          ? this.postService.pollPosts(since).pipe(
              tap((res) => {
                if (res.data?.length) {
                  this.prependPosts(res.data);
                  this.setLastPollTs(Date.now());
                }
              }),
              catchError(() => EMPTY)
            )
          : EMPTY
      )
    )
  );

  readonly likePost = this.effect<number>((postId$) =>
    postId$.pipe(
      switchMap((postId) =>
        this.postService.likePost(postId).pipe(
          tap(() => this.loadTimeline()), // ✅ recarga completa al dar like
          catchError((err) => {
            console.error('Error al dar like', err);
            return EMPTY;
          })
        )
      )
    )
  );


  readonly loadComments = this.effect<number>((postId$) =>
    postId$.pipe(
      switchMap((postId) =>
        this.postService.getPostComments(postId).pipe(
          tap({
            next: (res) => this.setCommentsForPost({ postId, comments: res.data ?? [] }),
            error: (err) => console.error('Error al obtener comentarios', err)
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );


  readonly addComment = this.effect<{ postId: number; text: string }>((params$) =>
    params$.pipe(
      switchMap(({ postId, text }) =>
        this.postService.createPostComment(postId, { text }).pipe(
          tap(() => this.loadComments(postId)), // Recarga después de crear
          catchError((err) => {
            console.error('Error al crear comentario', err);
            return EMPTY;
          })
        )
      )
    )
  );

  readonly deletePost = this.effect<number>((postId$) =>
    postId$.pipe(
      switchMap((postId) =>
        this.postService.deletePostById(postId).pipe(
          tap(() => {
            this.loadTimeline(); // recarga los posts si estás en timeline
          }),
          catchError((err) => {
            console.error('Error al eliminar el post', err);
            return EMPTY;
          })
        )
      )
    )
  );



}
