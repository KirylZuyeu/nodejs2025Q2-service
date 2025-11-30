import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IAlbum } from '../../common/interfaces';
import { CreateAlbumDto } from './dto/create-album.dto';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  private albums: IAlbum[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly tracksService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  create(createAlbumDto: CreateAlbumDto): IAlbum {
    const album: IAlbum = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };

    this.albums.push(album);
    return album;
  }

  findAll(): IAlbum[] {
    return this.albums;
  }

  findOne(id: string): IAlbum {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  update(id: string, updateAlbumDto: CreateAlbumDto): IAlbum {
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId || null;

    return album;
  }

  remove(id: string): void {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }

    this.tracksService.removeAlbumReferences(id);
    this.favoritesService.removeAlbumFromFavorites(id);

    this.albums.splice(index, 1);
  }

  removeArtistReferences(artistId: string): void {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }

  exists(id: string): boolean {
    return this.albums.some((album) => album.id === id);
  }

  getAlbumsByIds(ids: string[]): IAlbum[] {
    return this.albums.filter((album) => ids.includes(album.id));
  }
}
