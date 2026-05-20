import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async createGoal(
    userId: number,
    data: {
      title: string;
      description?: string;
      targetDate?: string;
      status?: string;
    },
  ) {
    return this.prisma.goal.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        status: data.status || 'open',
      },
    });
  }

  async getGoals(userId: number) {
    return this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateGoal(
    id: number,
    userId: number,
    data: Partial<{
      title: string;
      description: string;
      targetDate: string;
      status: string;
    }>,
  ) {
    return this.prisma.goal.updateMany({
      where: { id, userId },
      data: {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
      },
    });
  }

  async deleteGoal(id: number, userId: number) {
    return this.prisma.goal.deleteMany({
      where: { id, userId },
    });
  }
}
