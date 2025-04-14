export * from './auth.service';
import { AuthService } from './auth.service';
export * from './comments.service';
import { CommentsService } from './comments.service';
export const APIS = [AuthService, CommentsService];
