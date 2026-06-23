import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class BrowserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const userAgent = request.header('user-agent');
    const browserClient = userAgent?.split('/')[0] || 'Unknown';
    request.browser = browserClient;
    return next.handle();
  }
}
