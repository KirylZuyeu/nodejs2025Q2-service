import { Injectable } from '@nestjs/common';

@Injectable()
export class AlbumService {
  getHello(): string {
    return 'Hello World!';
  }
}
