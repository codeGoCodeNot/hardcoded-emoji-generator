import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AppService } from '../../app.service';

@Injectable()
export class EmojiValidationPipe implements PipeTransform {
  constructor(private appService: AppService) {}

  transform(value: any) {
    if (value === undefined || value === null) return;

    const maxIndex = this.appService.getEmojis().length - 1;
    const numericValue = +value;

    if (isNaN(numericValue))
      throw new BadRequestException('Index must be a number');
    if (numericValue < 0 || numericValue > maxIndex)
      throw new BadRequestException(`Index must be between 0 and ${maxIndex}`);
    return numericValue;
  }
}
