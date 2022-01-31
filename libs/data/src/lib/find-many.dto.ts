import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindManyDto implements Prisma.WebhookFindManyArgs {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  take?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  skip?: number;
}
