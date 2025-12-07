import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IFavoritesResponse } from '../../common/interfaces';
import { validateUuid } from '../../utils/uuid-validation';

@Injectable()
export class FavoritesService {
  // Константа для ID единственной записи Favorites (по ТЗ список избранного один)
  private readonly favoritesId = 'global-favorites-id';

  constructor(private prisma: PrismaService) {}

  // Метод получения или создания единственного списка избранного
  private async getOrCreateFavorites() {
    let favorites = await this.prisma.favorites.findFirst();
    if (!favorites) {
      favorites = await this.prisma.favorites.create({ data: {} });
    }
    return favorites;
  }

  async getAll(): Promise<IFavoritesResponse> {
  const favorites = await this.prisma.favorites.findFirst({
    include: {
      artists: true, 
      albums: true,
      tracks: true,
    },
  });

  return {
    artists: favorites?.artists || [],
    albums: favorites?.albums || [],
    tracks: favorites?.tracks || [],
  };
}

  async addArtist(id: string): Promise<string> {
    if (!validateUuid(id)) throw new BadRequestException('Invalid UUID');

    const favorites = await this.getOrCreateFavorites();
    try {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: { artists: { connect: { id } } },
      });
      return 'Artist added to favorites';
    } catch {
      throw new UnprocessableEntityException('Artist not found');
    }
  }

  async deleteArtist(id: string): Promise<void> {
    const favorites = await this.prisma.favorites.findFirst();
    try {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: { artists: { disconnect: { id } } },
      });
    } catch {
      throw new NotFoundException('Artist is not in favorites');
    }
  }

  async addAlbum(id: string): Promise<string> {
    if (!validateUuid(id)) throw new BadRequestException('Invalid UUID');

    const favorites = await this.getOrCreateFavorites();
    try {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: { albums: { connect: { id } } },
      });
      return 'Album added to favorites';
    } catch {
      throw new UnprocessableEntityException('Album not found');
    }
  }

  async deleteAlbum(id: string): Promise<void> {
    const favorites = await this.prisma.favorites.findFirst();
    try {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: { albums: { disconnect: { id } } },
      });
    } catch {
      throw new NotFoundException('Album is not in favorites');
    }
  }

  async addTrack(id: string): Promise<string> {
    if (!validateUuid(id)) throw new BadRequestException('Invalid UUID');

    const favorites = await this.getOrCreateFavorites();
    try {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: { tracks: { connect: { id } } },
      });
      return 'Track added to favorites';
    } catch {
      throw new UnprocessableEntityException('Track not found');
    }
  }

  async deleteTrack(id: string): Promise<void> {
    const favorites = await this.prisma.favorites.findFirst();
    try {
      await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: { tracks: { disconnect: { id } } },
      });
    } catch {
      throw new NotFoundException('Track is not in favorites');
    }
  }
}
