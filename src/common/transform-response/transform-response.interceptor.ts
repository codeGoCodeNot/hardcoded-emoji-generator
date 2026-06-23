import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => console.log('Interceptor: transform response')),
      map((data) => ({
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
