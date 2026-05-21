import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      try {
        this.logger.log('Running database migrations...');
        execSync('npx prisma migrate deploy', {
          stdio: 'inherit',
          env: process.env,
        });
        this.logger.log('Migrations completed');
      } catch (error) {
        this.logger.error('Migration failed, attempting db push...', error);
        execSync('npx prisma db push --accept-data-loss', {
          stdio: 'inherit',
          env: process.env,
        });
      }
    }
    await this.$connect();
    this.logger.log('Database connected');
  }
}
