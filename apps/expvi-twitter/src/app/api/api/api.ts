export * from './auth.service';
import { AuthService } from './auth.service';
export * from './comments.service';
import { CommentsService } from './comments.service';
export * from './posts.service';
import { PostsService } from './posts.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [AuthService, CommentsService, PostsService, UsersService];
