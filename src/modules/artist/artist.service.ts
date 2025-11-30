import { Injectable } from '@nestjs/common';

@Injectable()
export class ArtistService {
  getHello(): string {
    return 'Hello World!';
  }
}
