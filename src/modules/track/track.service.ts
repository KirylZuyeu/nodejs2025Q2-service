import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ITrack } from '../../common/interfaces';
import { CreateTrackDto } from './dto/create-track.dto';
import { validateUuid } from '../../utils/uuid-validation';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async createTrack(createTrackDto: CreateTrackDto): Promise<ITrack> {
    return await this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
        duration: createTrackDto.duration,
      },
    });
  }

  async getAllTracks(): Promise<ITrack[]> {
    return await this.prisma.track.findMany();
  }

  async getTrackById(id: string): Promise<ITrack> {
    if (!validateUuid(id)) {
      throw new BadRequestException('Track Id is invalid (not uuid)');
    }

    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async updateTrack(id: string, updateTrackDto: CreateTrackDto): Promise<ITrack> {
    if (!validateUuid(id)) {
      throw new BadRequestException('Track Id is invalid (not uuid)');
    }

    try {
      return await this.prisma.track.update({
        where: { id },
        data: {
          name: updateTrackDto.name,
          artistId: updateTrackDto.artistId || null,
          albumId: updateTrackDto.albumId || null,
          duration: updateTrackDto.duration,
        },
      });
    } catch {
      throw new NotFoundException('Track not found');
    }
  }

  async deleteTrack(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException('Track Id is invalid (not uuid)');
    }

    try {
      await this.prisma.track.delete({ where: { id } });
      // БД сама очистит ссылки в Favorites благодаря onDelete: SetNull/Cascade
    } catch {
      throw new NotFoundException('Track not found');
    }
  }
}
