import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeditationService {
  constructor(private prisma: PrismaService) {}

  async createSession(
    userId: number,
    data: { durationMinutes: number; type?: string; notes?: string },
  ) {
    return this.prisma.meditationSession.create({
      data: { userId, ...data },
    });
  }

  async getSessions(userId: number) {
    return this.prisma.meditationSession.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async updateSession(
    id: number,
    userId: number,
    data: Partial<{ durationMinutes: number; type: string; notes: string }>,
  ) {
    return this.prisma.meditationSession.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deleteSession(id: number, userId: number) {
    return this.prisma.meditationSession.deleteMany({
      where: { id, userId },
    });
  }
}
