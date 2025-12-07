import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IArtist } from '../../common/interfaces';
import { CreateArtistDto } from './dto/create-artist.dto';
import { validateUuid } from '../../utils/uuid-validation';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<IArtist> {
    return await this.prisma.artist.create({
      data: {
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });
  }

  async findAll(): Promise<IArtist[]> {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<IArtist> {
    if (!validateUuid(id)) {
      throw new BadRequestException('Artist Id is invalid (not uuid)');
    }

    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async update(id: string, updateArtistDto: CreateArtistDto): Promise<IArtist> {
    if (!validateUuid(id)) {
      throw new BadRequestException('Artist Id is invalid (not uuid)');
    }

    try {
      return await this.prisma.artist.update({
        where: { id },
        data: {
          name: updateArtistDto.name,
          grammy: updateArtistDto.grammy,
        },
      });
    } catch {
      throw new NotFoundException('Artist not found');
    }
  }

  async remove(id: string): Promise<void> {
    if (!validateUuid(id)) {
      throw new BadRequestException('Artist Id is invalid (not uuid)');
    }

    try {
      await this.prisma.artist.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Artist not found');
    }
  }
}
