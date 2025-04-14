import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineStore } from './../../store/timeline/timeline.store';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { PostCardComponent } from '../post-card/post-card.component';


@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, AsyncPipe, PostCardComponent],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit {
  private timelineStore = inject(TimelineStore);

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
