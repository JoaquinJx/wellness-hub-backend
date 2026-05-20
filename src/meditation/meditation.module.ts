import { Module } from '@nestjs/common';
import { MeditationService } from './meditation.service';
import { MeditationController } from './meditation.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MeditationService],
  controllers: [MeditationController],
})
export class MeditationModule {}
