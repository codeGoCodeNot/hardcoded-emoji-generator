import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getEmoji(index?: number) {
    const emojis = this.getEmojis();
    const emojiIdx = index ?? Math.floor(Math.random() * emojis.length);

    return emojis[emojiIdx];
  }

  getEmojis() {
    return ['😀', '😂', '😍', '🤔', '🙈', '🎉', '🚀', '🌟', '🍕', '🐱'];
  }
}
