import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { LoggerService } from '../../logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly logger: LoggerService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.info('AuthGuard: Checking API key');
    console.log('AuthGuard: Checking API key');
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    if (apiKey !== `SECRET`) {
      throw new UnauthorizedException('Invalid API key');
    }
    this.logger.info('AuthGuard: Passed API key check');
    return true;
  }
}
