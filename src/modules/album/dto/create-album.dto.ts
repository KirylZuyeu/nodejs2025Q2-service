import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  year: number;

  @IsString()
  @IsOptional()
  artistId?: string | null;
}
