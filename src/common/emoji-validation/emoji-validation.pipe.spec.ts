import { BadRequestException } from '@nestjs/common';
import { AppService } from '../../app.service';
import { EmojiValidationPipe } from './emoji-validation.pipe';

describe('EmojiValidationPipe', () => {
  let pipe: EmojiValidationPipe;
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
    pipe = new EmojiValidationPipe(appService);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return undefined if value is not provided', () => {
    const result = pipe.transform(undefined);
    expect(result).toBeUndefined();
  });

  it('should throw BadRequestException if value is not a number', () => {
    expect(() => pipe.transform('not-a-number')).toThrow(
      'Index must be a number',
    );
  });

  it('should throw if index is out of range', () => {
    const maxIndex = appService.getEmojis().length - 1;
    expect(() => pipe.transform(String(maxIndex + 1))).toThrow(
      BadRequestException,
    );
  });

  it('should return the value if it is a valid index', () => {
    const result = pipe.transform('5');
    expect(result).toBe(5);
  });

  it('should throw if index is negative', () => {
    expect(() => pipe.transform('-1')).toThrow(BadRequestException);
  });
});
