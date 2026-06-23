import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { createMock } from '@golevelup/ts-jest';
import { LoggerService } from '../../logger.service';

describe('AuthGuard', () => {
  const authGuard = new AuthGuard(new LoggerService());
  it('should be defined', () => {
    expect(new AuthGuard(new LoggerService())).toBeDefined();
  });

  it('should allow access with correct API key', () => {
    const CONTEXT = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => 'SECRET',
          headers: { 'x-api-key': 'SECRET' },
        }),
      }),
    });
    const result = authGuard.canActivate(CONTEXT);
    expect(result).toBe(true);
  });

  it('should not allow access with no API key', () => {
    const CONTEXT = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => undefined,
          headers: {},
        }),
      }),
    });
    expect(() => authGuard.canActivate(CONTEXT)).toThrow(UnauthorizedException);
  });

  it('should not allow access with invalid API key', () => {
    const CONTEXT = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => 'INVALID',
          headers: { 'x-api-key': 'INVALID' },
        }),
      }),
    });
    expect(() => authGuard.canActivate(CONTEXT)).toThrow(UnauthorizedException);
  });
});
