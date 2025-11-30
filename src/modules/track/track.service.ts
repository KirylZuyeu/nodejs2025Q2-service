import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ITrack } from '../../common/interfaces';
import { CreateTrackDto } from './dto/create-track.dto';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  private tracks: ITrack[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  createTrack(createTrackDto: CreateTrackDto): ITrack {
    const track: ITrack = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };

    this.tracks.push(track);
    return track;
  }

  getAllTracks(): ITrack[] {
    return this.tracks;
  }

  getTrackById(id: string): ITrack {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  updateTrack(id: string, updateTrackDto: CreateTrackDto): ITrack {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId || null;
    track.albumId = updateTrackDto.albumId || null;
    track.duration = updateTrackDto.duration;

    return track;
  }

  deleteTrack(id: string): void {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }

    this.favoritesService.removeTrackFromFavorites(id);

    this.tracks.splice(index, 1);
  }

  removeArtistReferences(artistId: string): void {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  removeAlbumReferences(albumId: string): void {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }

  exists(id: string): boolean {
    return this.tracks.some((track) => track.id === id);
  }

  getTracksByIds(ids: string[]): ITrack[] {
    return this.tracks.filter((track) => ids.includes(track.id));
  }
}
