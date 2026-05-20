import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FitnessService } from './fitness.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('fitness')
@UseGuards(JwtAuthGuard)
export class FitnessController {
  constructor(private fitnessService: FitnessService) {}

  // Plans
  @Post('plans')
  createPlan(
    @Request() req: AuthenticatedRequest,
    @Body()
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
    return this.fitnessService.createPlan(req.user.id, data);
  }

  @Get('plans')
  getPlans(@Request() req: AuthenticatedRequest) {
    return this.fitnessService.getPlans(req.user.id);
  }

  @Put('plans/:id')
  updatePlan(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() data: Partial<{ name: string; description: string }>,
  ) {
    return this.fitnessService.updatePlan(+id, req.user.id, data);
  }

  @Delete('plans/:id')
  deletePlan(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.fitnessService.deletePlan(+id, req.user.id);
  }

  // Workouts
  @Post('workouts')
  startWorkout(
    @Request() req: AuthenticatedRequest,
    @Body() data: { workoutPlanId: number },
  ) {
    return this.fitnessService.startWorkout(req.user.id, data.workoutPlanId);
  }

  @Put('workouts/:id/complete')
  completeWorkout(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() data: { notes?: string },
  ) {
    return this.fitnessService.completeWorkout(+id, req.user.id, data.notes);
  }

  @Get('workouts')
  getWorkouts(@Request() req: AuthenticatedRequest) {
    return this.fitnessService.getWorkouts(req.user.id);
  }
}
