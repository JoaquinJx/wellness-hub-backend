import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HydrationService {
  constructor(private prisma: PrismaService) {}

  async createEntry(
    userId: number,
    data: { amountMl: number; notes?: string },
  ) {
    return this.prisma.hydrationLog.create({
      data: { userId, ...data },
    });
  }

  async getEntries(userId: number) {
    return this.prisma.hydrationLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async updateEntry(
    id: number,
    userId: number,
    data: Partial<{ amountMl: number; notes: string }>,
  ) {
    return this.prisma.hydrationLog.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deleteEntry(id: number, userId: number) {
    return this.prisma.hydrationLog.deleteMany({
      where: { id, userId },
    });
  }
}
