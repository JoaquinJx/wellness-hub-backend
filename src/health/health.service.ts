import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async createRecord(
    userId: number,
    data: {
      weight?: number;
      bloodPressure?: string;
      heartRate?: number;
      notes?: string;
    },
  ) {
    return this.prisma.healthRecord.create({
      data: { userId, ...data },
    });
  }

  async getRecords(userId: number) {
    return this.prisma.healthRecord.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async updateRecord(
    id: number,
    userId: number,
    data: Partial<{
      weight: number;
      bloodPressure: string;
      heartRate: number;
      notes: string;
    }>,
  ) {
    return this.prisma.healthRecord.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deleteRecord(id: number, userId: number) {
    return this.prisma.healthRecord.deleteMany({
      where: { id, userId },
    });
  }
}
