import { Comment } from './../../api/model/comment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TimelineStore } from "../../store/timeline/timeline.store";
import { Observable } from "rxjs";
import { Component, Input, OnInit } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, DialogModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number;

  form!: FormGroup;
  comments$!: Observable<Comment[]>;

  constructor(private fb: FormBuilder, private store: TimelineStore) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      text: ['', Validators.required]
    });

    this.comments$ = this.store.selectCommentsByPostId(this.postId);
    this.store.loadComments(this.postId);
  }

  submit() {
    if (this.form.invalid) return;

    const text = this.form.value.text;
    this.store.addComment({ postId: this.postId, text });
    this.form.reset();
  }
}
