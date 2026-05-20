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
import { MentalHealthService } from './mental-health.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('mental-health')
@UseGuards(JwtAuthGuard)
export class MentalHealthController {
  constructor(private mentalHealthService: MentalHealthService) {}

  @Post()
  createEntry(
    @Request() req: AuthenticatedRequest,
    @Body() data: { mood: string; stressLevel?: number; notes?: string },
  ) {
    return this.mentalHealthService.createEntry(req.user.id, data);
  }

  @Get()
  getEntries(@Request() req: AuthenticatedRequest) {
    return this.mentalHealthService.getEntries(req.user.id);
  }

  @Put(':id')
  updateEntry(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() data: Partial<{ mood: string; stressLevel: number; notes: string }>,
  ) {
    return this.mentalHealthService.updateEntry(+id, req.user.id, data);
  }

  @Delete(':id')
  deleteEntry(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.mentalHealthService.deleteEntry(+id, req.user.id);
  }
}
