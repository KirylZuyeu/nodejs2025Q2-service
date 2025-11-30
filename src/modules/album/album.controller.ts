import { Controller, Get } from '@nestjs/common';
import { AlbumService } from './album.service';

@Controller()
export class AlbumController {
  constructor(private readonly appService: AlbumService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
