import { Type } from 'class-transformer';
import { IsDateString, IsString, ValidateNested } from 'class-validator';

class TimeQueryDto {
  @IsDateString()
  public timestampGte: string;
  @IsDateString()
  public timestampLte: string;
}

export class QueryLogDto {
  @IsString()
  public level?: string;
  @IsString()
  public message?: string;
  @IsString()
  public resourceId?: string;
  @IsString()
  public traceId?: string;
  @IsString()
  public spanId?: string;
  @IsString()
  public commit?: string;
  @IsString()
  public parentResourceId?: string;
  @IsDateString()
  public timestamp?: string;
  @ValidateNested()
  @Type(() => TimeQueryDto)
  public timeRange?: TimeQueryDto;
}
