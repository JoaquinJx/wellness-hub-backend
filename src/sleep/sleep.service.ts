import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SleepService {
  constructor(private prisma: PrismaService) {}

  async createEntry(
    userId: number,
    data: { durationMinutes: number; quality?: string; notes?: string },
  ) {
    return this.prisma.sleepLog.create({
      data: { userId, ...data },
    });
  }

  async getEntries(userId: number) {
    return this.prisma.sleepLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async updateEntry(
    id: number,
    userId: number,
    data: Partial<{ durationMinutes: number; quality: string; notes: string }>,
  ) {
    return this.prisma.sleepLog.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deleteEntry(id: number, userId: number) {
    return this.prisma.sleepLog.deleteMany({
      where: { id, userId },
    });
  }
}
