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
import { NutritionService } from './nutrition.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface User {
  id: number;
  email: string;
  name: string | null;
}

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('nutrition')
@UseGuards(JwtAuthGuard)
export class NutritionController {
  constructor(private nutritionService: NutritionService) {}

  @Post()
  createEntry(
    @Request() req: AuthenticatedRequest,
    @Body()
    data: {
      mealType: string;
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      notes?: string;
    },
  ) {
    return this.nutritionService.createEntry(req.user.id, data);
  }

  @Get()
  getEntries(@Request() req: AuthenticatedRequest) {
    return this.nutritionService.getEntries(req.user.id);
  }

  @Put(':id')
  updateEntry(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body()
    data: Partial<{
      mealType: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      notes: string;
    }>,
  ) {
    return this.nutritionService.updateEntry(+id, req.user.id, data);
  }

  @Delete(':id')
  deleteEntry(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.nutritionService.deleteEntry(+id, req.user.id);
  }

  @Post('chat-recommendation')
  async chatRecommendation(
    @Request() req: AuthenticatedRequest,
    @Body()
    data: {
      userMessage: string;
      userProfile: {
        weight: number;
        height: number;
        activityLevel: string;
        physicalState: string;
        mentalState: string;
        goals: string;
      };
      conversationHistory?: { role: string; content: string }[];
      language?: string;
    },
  ) {
    return this.nutritionService.getChatRecommendation(
      req.user.id,
      req.user.name || req.user.email,
      data.userMessage,
      data.userProfile,
      data.conversationHistory,
      data.language,
    );
  }
}
