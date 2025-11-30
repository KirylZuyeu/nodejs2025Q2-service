import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoritesService {
  getHello(): string {
    return 'Hello World!';
  }
}
