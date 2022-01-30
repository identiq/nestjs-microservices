import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class WebhookCreateDto implements Prisma.WebhookCreateInput {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  topic: string;
}
