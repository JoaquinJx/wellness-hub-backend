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
import { SleepService } from './sleep.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('sleep')
@UseGuards(JwtAuthGuard)
export class SleepController {
  constructor(private sleepService: SleepService) {}

  @Post()
  createEntry(
    @Request() req: AuthenticatedRequest,
    @Body() data: { durationMinutes: number; quality?: string; notes?: string },
  ) {
    return this.sleepService.createEntry(req.user.id, data);
  }

  @Get()
  getEntries(@Request() req: AuthenticatedRequest) {
    return this.sleepService.getEntries(req.user.id);
  }

  @Put(':id')
  updateEntry(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body()
    data: Partial<{ durationMinutes: number; quality: string; notes: string }>,
  ) {
    return this.sleepService.updateEntry(+id, req.user.id, data);
  }

  @Delete(':id')
  deleteEntry(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.sleepService.deleteEntry(+id, req.user.id);
  }
}
