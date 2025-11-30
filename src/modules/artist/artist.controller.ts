import { Controller, Get } from '@nestjs/common';
import { ArtistService } from './artist.service';

@Controller()
export class ArtistController {
  constructor(private readonly appService: ArtistService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
