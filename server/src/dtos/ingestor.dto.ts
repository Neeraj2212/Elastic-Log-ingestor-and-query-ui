import { Type } from 'class-transformer';
import { IsDateString, IsString, ValidateNested, IsDefined } from 'class-validator';

class MetadataDto {
  @IsDefined()
  @IsString()
  public parentResourceId: string;
}

export class IngestLogDto {
  @IsString()
  public level: string;
  @IsString()
  public message: string;
  @IsDateString()
  public timestamp: string;
  @IsString()
  public resourceId: string;
  @IsString()
  public traceId: string;
  @IsString()
  public spanId: string;
  @IsString()
  public commit: string;
  @ValidateNested()
  @Type(() => MetadataDto)
  public metadata: MetadataDto;
}
