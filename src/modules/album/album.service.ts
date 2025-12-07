import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IAlbum } from '../../common/interfaces';
import { CreateAlbumDto } from './dto/create-album.dto';
import { validateUuid } from '../../utils/uuid-validation';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<IAlbum> {
    return await this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId || null,
      },
    });
  }

  async findAll(): Promise<IAlbum[]> {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<IAlbum> {
    if (!validateUuid(id)) {
      throw new BadRequestException('Album Id is invalid (not uuid)');
    }

    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async update(id: string, updateAlbumDto: CreateAlbumDto): Promise<IAlbum> {
    if (!validateUuid(id)) {
      throw new BadRequestException('Album Id is invalid (not uuid)');
    }

    try {
      return await this.prisma.album.update({
        where: { id },
        data: {
          name: updateAlbumDto.name,
          year: updateAlbumDto.year,
          artistId: updateAlbumDto.artistId || null,
        },
      });
    } catch {
      throw new NotFoundException('Album not found');
    }
  }

  async remove(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException('Album Id is invalid (not uuid)');
    }

    try {
      await this.prisma.album.delete({ where: { id } });
      // Prisma сама занулит ссылки в Track и очистит Favorites благодаря onDelete: SetNull в схеме
    } catch {
      throw new NotFoundException('Album not found');
    }
  }
}
