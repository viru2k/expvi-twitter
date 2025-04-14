
import { User } from './../../api/model/user';
import { Post } from './../../api/model/post';
import { Injectable } from '@angular/core';
import { PostsService } from './..//../api/api/posts.service';
import { ComponentStore } from '@ngrx/component-store';
 // Wrapper del API

import { tap, switchMap, catchError, EMPTY, interval, withLatestFrom, map, forkJoin } from 'rxjs';

export interface TimelineState {
  posts: Array<Post & { user?: User }>;
  isLoading: boolean;
  isPolling: boolean;
  nextCursor?: string;
  searchTerm: string;
  lastPollTs?: number;
}

const DEFAULT_STATE: TimelineState = {
  posts: [],
  isLoading: false,
  isPolling: false,
  searchTerm: ''
};

@Injectable({ providedIn: 'root' })
export class TimelineStore extends ComponentStore<TimelineState> {
  constructor(private postService: PostsService) {
    super(DEFAULT_STATE);
  }

  readonly posts$ = this.select((s) => s.posts);
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

/*   // Initial load or search
  readonly loadTimeline = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.postService.listPosts().pipe( // sin argumentos
          tap((res) => {
            this.setPosts(res?.data ?? []);
            this.setNextCursor(res?.next_cursor);
            this.setLastPollTs(Date.now());
          }),
          catchError(() => EMPTY),
          tap(() => this.setLoading(false))
        )
      )
    )
  ); */

  readonly loadTimeline = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.postService.listPosts().pipe(
          switchMap((res) =>
            forkJoin(
              (res.data ?? [])
                .filter((post) => post.id !== undefined)
                .map((post) =>
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  this.postService.getPostUser(post.id!).pipe(
                    map((user) => ({ ...post, user: user.data }))
                  )
                )
            )
          ),

          tap((enrichedPosts) => {
            this.setPosts(enrichedPosts);
            this.setLastPollTs(Date.now());
          }),
          catchError(() => EMPTY),
          tap(() => this.setLoading(false))
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
    interval(10000).pipe(
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
}
