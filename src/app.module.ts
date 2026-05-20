import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { FitnessModule } from './fitness/fitness.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { SleepModule } from './sleep/sleep.module';
import { MentalHealthModule } from './mental-health/mental-health.module';
import { HydrationModule } from './hydration/hydration.module';
import { GoalsModule } from './goals/goals.module';
import { MeditationModule } from './meditation/meditation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
    PrismaModule,
    AuthModule,
    HealthModule,
    FitnessModule,
    NutritionModule,
    SleepModule,
    MentalHealthModule,
    HydrationModule,
    GoalsModule,
    MeditationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
