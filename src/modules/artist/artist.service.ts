import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IArtist } from '../../common/interfaces';
import { CreateArtistDto } from './dto/create-artist.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';
import { validateUuid } from '../../utils/uuid-validation';

@Injectable()
export class ArtistService {
  private artists: IArtist[] = [];

  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  create(createArtistDto: CreateArtistDto): IArtist {
    const artist: IArtist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.artists.push(artist);
    return artist;
  }

  findAll(): IArtist[] {
    return this.artists;
  }

  findOne(id: string): IArtist {
    if (!validateUuid(id)) {
      throw new BadRequestException('Artist Id is invalid (not uuid)');
    }

    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  update(id: string, updateArtistDto: CreateArtistDto): IArtist {
    if (!validateUuid(id)) {
      throw new BadRequestException('Artist Id is invalid (not uuid)');
    }

    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return artist;
  }

  remove(id: string): void {
    if (!validateUuid(id)) {
      throw new BadRequestException('Artist Id is invalid (not uuid)');
    }


    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.albumService.removeArtistReferences(id);
    this.trackService.removeArtistReferences(id);
    this.favoritesService.removeArtistFromFavorites(id);

    this.artists.splice(index, 1);
  }

  exists(id: string): boolean {
    return this.artists.some((artist) => artist.id === id);
  }

  getArtistsByIds(ids: string[]): IArtist[] {
    return this.artists.filter((artist) => ids.includes(artist.id));
  }
}
