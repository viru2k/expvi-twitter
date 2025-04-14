import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TweetComponent } from '../tweet/tweet.component';

@Component({
  standalone: true,
  selector: 'app-timeline',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TweetComponent
  ],

  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit {
  public tweets: any[] = [];
  ngOnInit(): void {
    this.tweets = [
      { id: 1, text: 'tweet 1' },
      { id: 2, text: 'tweet 2' },
      { id: 3, text: 'tweet 3' }
    ]
  }
}

