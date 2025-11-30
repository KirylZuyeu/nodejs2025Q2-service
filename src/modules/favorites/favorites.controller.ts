import { Controller, Get } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller()
export class FavoritesController {
  constructor(private readonly appService: FavoritesService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
