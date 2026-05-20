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
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post()
  createGoal(
    @Request() req: AuthenticatedRequest,
    @Body()
    data: {
      title: string;
      description?: string;
      targetDate?: string;
      status?: string;
    },
  ) {
    return this.goalsService.createGoal(req.user.id, data);
  }

  @Get()
  getGoals(@Request() req: AuthenticatedRequest) {
    return this.goalsService.getGoals(req.user.id);
  }

  @Put(':id')
  updateGoal(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body()
    data: Partial<{
      title: string;
      description: string;
      targetDate: string;
      status: string;
    }>,
  ) {
    return this.goalsService.updateGoal(+id, req.user.id, data);
  }

  @Delete(':id')
  deleteGoal(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.goalsService.deleteGoal(+id, req.user.id);
  }
}
