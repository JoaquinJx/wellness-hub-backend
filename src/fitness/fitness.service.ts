import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FitnessService {
  constructor(private prisma: PrismaService) {}

  // Workout Plans
  async createPlan(
    userId: number,
    data: {
      name: string;
      description?: string;
      exercises: {
        name: string;
        sets?: number;
        reps?: number;
        duration?: number;
        notes?: string;
      }[];
    },
  ) {
    return this.prisma.workoutPlan.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        exercises: {
          create: data.exercises,
        },
      },
      include: { exercises: true },
    });
  }

  async getPlans(userId: number) {
    return this.prisma.workoutPlan.findMany({
      where: { userId },
      include: { exercises: true },
    });
  }

  async updatePlan(
    id: number,
    userId: number,
    data: Partial<{ name: string; description: string }>,
  ) {
    return this.prisma.workoutPlan.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deletePlan(id: number, userId: number) {
    return this.prisma.workoutPlan.deleteMany({
      where: { id, userId },
    });
  }

  // User Workouts
  async startWorkout(userId: number, workoutPlanId: number) {
    return this.prisma.userWorkout.create({
      data: { userId, workoutPlanId },
    });
  }

  async completeWorkout(id: number, userId: number, notes?: string) {
    return this.prisma.userWorkout.updateMany({
      where: { id, userId },
      data: { completed: true, notes },
    });
  }

  async getWorkouts(userId: number) {
    return this.prisma.userWorkout.findMany({
      where: { userId },
      include: { workoutPlan: true },
      orderBy: { date: 'desc' },
    });
  }
}
