import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MentalHealthService {
  constructor(private prisma: PrismaService) {}

  async createEntry(
    userId: number,
    data: { mood: string; stressLevel?: number; notes?: string },
  ) {
    return this.prisma.mentalHealthLog.create({
      data: { userId, ...data },
    });
  }

  async getEntries(userId: number) {
    return this.prisma.mentalHealthLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async updateEntry(
    id: number,
    userId: number,
    data: Partial<{ mood: string; stressLevel: number; notes: string }>,
  ) {
    return this.prisma.mentalHealthLog.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deleteEntry(id: number, userId: number) {
    return this.prisma.mentalHealthLog.deleteMany({
      where: { id, userId },
    });
  }
}
