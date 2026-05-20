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
import { MeditationService } from './meditation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('meditation')
@UseGuards(JwtAuthGuard)
export class MeditationController {
  constructor(private meditationService: MeditationService) {}

  @Post()
  createSession(
    @Request() req: AuthenticatedRequest,
    @Body() data: { durationMinutes: number; type?: string; notes?: string },
  ) {
    return this.meditationService.createSession(req.user.id, data);
  }

  @Get()
  getSessions(@Request() req: AuthenticatedRequest) {
    return this.meditationService.getSessions(req.user.id);
  }

  @Put(':id')
  updateSession(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body()
    data: Partial<{ durationMinutes: number; type: string; notes: string }>,
  ) {
    return this.meditationService.updateSession(+id, req.user.id, data);
  }

  @Delete(':id')
  deleteSession(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.meditationService.deleteSession(+id, req.user.id);
  }
}
