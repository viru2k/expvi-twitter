import { PostsService } from './../../../app/api/api/posts.service';
import { ButtonModule } from 'primeng/button';
import { CreatePostRequest } from './../../api/model/createPostRequest';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-create-post',
  standalone: true,
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
  ]
})
export class CreatePostComponent {
  visible = false;
  form: FormGroup;
  @Output() postCreated = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private postService: PostsService) {
    this.form = this.fb.group({
      text: ['', Validators.required],
      type: ['text', Validators.required],
      picture_url: [''],
      video_url: ['']
    });
  }


  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
    this.form.reset({ type: 'text' });
  }

  submit() {
    if (this.form.invalid) return;

    const { text, type, picture_url, video_url } = this.form.value;

    const payload: CreatePostRequest = {
      text: text!,
      type: type as 'text' | 'picture' | 'video',
      ...(type === 'picture' && picture_url ? { picture_url } : {}),
      ...(type === 'video' && video_url ? { video_url } : {})
    };

    this.postService.createPost(payload).subscribe({
      next: () => {
        this.postCreated.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error creating post', err);
      }
    });
  }
}
