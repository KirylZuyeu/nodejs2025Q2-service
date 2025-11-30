import { Controller, Get } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller()
export class TrackController {
  constructor(private readonly appService: TrackService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
