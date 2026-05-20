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
import { HealthService } from './health.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('health')
@UseGuards(JwtAuthGuard)
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body()
    data: {
      weight?: number;
      bloodPressure?: string;
      heartRate?: number;
      notes?: string;
    },
  ) {
    return this.healthService.createRecord(req.user.id, data);
  }

  @Get()
  getRecords(@Request() req: AuthenticatedRequest) {
    return this.healthService.getRecords(req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body()
    data: Partial<{
      weight: number;
      bloodPressure: string;
      heartRate: number;
      notes: string;
    }>,
  ) {
    return this.healthService.updateRecord(+id, req.user.id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.healthService.deleteRecord(+id, req.user.id);
  }
}
