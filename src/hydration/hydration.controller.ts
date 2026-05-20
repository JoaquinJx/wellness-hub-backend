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
import { HydrationService } from './hydration.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('hydration')
@UseGuards(JwtAuthGuard)
export class HydrationController {
  constructor(private hydrationService: HydrationService) {}

  @Post()
  createEntry(
    @Request() req: AuthenticatedRequest,
    @Body() data: { amountMl: number; notes?: string },
  ) {
    return this.hydrationService.createEntry(req.user.id, data);
  }

  @Get()
  getEntries(@Request() req: AuthenticatedRequest) {
    return this.hydrationService.getEntries(req.user.id);
  }

  @Put(':id')
  updateEntry(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() data: Partial<{ amountMl: number; notes: string }>,
  ) {
    return this.hydrationService.updateEntry(+id, req.user.id, data);
  }

  @Delete(':id')
  deleteEntry(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.hydrationService.deleteEntry(+id, req.user.id);
  }
}
