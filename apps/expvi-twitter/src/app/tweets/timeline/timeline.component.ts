import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineStore } from './../../store/timeline/timeline.store';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { PostCardComponent } from '../post-card/post-card.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, ButtonModule, NgFor, NgIf, AsyncPipe, PostCardComponent, CreatePostComponent],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit {
  public  timelineStore = inject(TimelineStore);

  posts$ = this.timelineStore.posts$;
  isLoading$ = this.timelineStore.isLoading$;

  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;

  ngOnInit(): void {
    this.timelineStore.loadTimeline();
    this.timelineStore.startPolling();
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.timelineStore.loadMore();
      }
    });

    observer.observe(this.scrollAnchor.nativeElement);
  }
}
