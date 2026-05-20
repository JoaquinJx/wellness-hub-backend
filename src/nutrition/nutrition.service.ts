import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NutritionService {
  constructor(private prisma: PrismaService) {}

  async createEntry(
    userId: number,
    data: {
      mealType: string;
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      notes?: string;
    },
  ) {
    return this.prisma.nutritionLog.create({
      data: { userId, ...data },
    });
  }

  async getEntries(userId: number) {
    return this.prisma.nutritionLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async updateEntry(
    id: number,
    userId: number,
    data: Partial<{
      mealType: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      notes: string;
    }>,
  ) {
    return this.prisma.nutritionLog.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deleteEntry(id: number, userId: number) {
    return this.prisma.nutritionLog.deleteMany({
      where: { id, userId },
    });
  }

  async getChatRecommendation(
    userId: number,
    _userName: string,
    userMessage: string,
    userProfile: {
      weight: number;
      height: number;
      activityLevel: string;
      physicalState: string;
      mentalState: string;
      goals: string;
    },
    _conversationHistory?: { role: string; content: string }[],
    language?: string,
  ) {
    const lang = language === 'es' ? 'es' : 'en';
    const heightInMeters = userProfile.height / 100;
    const bmi = userProfile.weight / (heightInMeters * heightInMeters);

    const recommendation = this.generateNutritionRecommendation(
      userProfile,
      userMessage,
      bmi,
      lang,
    );

    await this.prisma.nutritionChat.create({
      data: {
        userId,
        userMessage,
        recommendation,
        weight: userProfile.weight,
        height: userProfile.height,
        activityLevel: userProfile.activityLevel,
        physicalState: userProfile.physicalState,
        mentalState: userProfile.mentalState,
        goals: userProfile.goals,
      },
    });

    return { recommendation };
  }

  private generateNutritionRecommendation(
    profile: {
      weight: number;
      height: number;
      activityLevel: string;
      physicalState: string;
      mentalState: string;
      goals: string;
    },
    userMessage: string,
    bmi: number,
    lang: 'en' | 'es',
  ): string {
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    const bmr = 10 * profile.weight + 6.25 * profile.height - 5;
    const tdee = bmr * (activityMultipliers[profile.activityLevel] ?? 1.55);
    const proteinGrams = Math.round(profile.weight * 1.6);
    const msg = userMessage.toLowerCase();

    const es = lang === 'es';
    let recommendation = '';

    // ── Calories ──────────────────────────────────────────────────────────────
    if (msg.includes('calori') || msg.includes('kcal') || msg.includes('cal')) {
      recommendation += es
        ? `Según tu perfil, tus necesidades calóricas diarias (TDEE) son aproximadamente **${Math.round(tdee)} kcal**.\n\n`
        : `Based on your profile, your estimated daily caloric needs (TDEE) are approximately **${Math.round(tdee)} kcal**.\n\n`;

      if (profile.goals.toLowerCase().includes(es ? 'perder' : 'lose') ||
          profile.goals.toLowerCase().includes('lose') ||
          profile.goals.toLowerCase().includes('perder')) {
        recommendation += es
          ? `Para perder peso, apunta a un déficit de 300-500 kcal diarias (${Math.round(tdee - 400)}-${Math.round(tdee - 300)} kcal/día) para perder ~0,5 kg por semana de forma segura.\n\n`
          : `For weight loss, aim for a 300-500 kcal daily deficit (${Math.round(tdee - 400)}-${Math.round(tdee - 300)} kcal/day) to lose ~0.5 kg per week safely.\n\n`;
      } else if (profile.goals.toLowerCase().includes('muscle') ||
                 profile.goals.toLowerCase().includes('músculo') ||
                 profile.goals.toLowerCase().includes('musculo')) {
        recommendation += es
          ? `Para ganar músculo, consume ${Math.round(tdee + 300)}-${Math.round(tdee + 500)} kcal/día con proteína adecuada (${proteinGrams}-${Math.round(profile.weight * 2.2)} g).\n\n`
          : `For muscle building, consume ${Math.round(tdee + 300)}-${Math.round(tdee + 500)} kcal/day with adequate protein (${proteinGrams}-${Math.round(profile.weight * 2.2)} g).\n\n`;
      }
    }

    // ── Protein / macros ──────────────────────────────────────────────────────
    if (msg.includes('protein') || msg.includes('proteín') || msg.includes('macro')) {
      recommendation += es
        ? `**Proteína recomendada:** ${proteinGrams} g/día (~${Math.round(((proteinGrams * 4) / tdee) * 100)}% de tus calorías).\nBuenas fuentes: pollo, pescado, huevos, yogur griego, legumbres, tofu, frutos secos.\n\n`
        : `**Protein recommendation:** ${proteinGrams} g/day (~${Math.round(((proteinGrams * 4) / tdee) * 100)}% of calories).\nGood sources: chicken, fish, eggs, Greek yogurt, legumes, tofu, nuts.\n\n`;
    }

    // ── Energy / tiredness ────────────────────────────────────────────────────
    if (msg.includes('energy') || msg.includes('energía') || msg.includes('energi') ||
        msg.includes('tired') || msg.includes('cansad')) {
      recommendation += es
        ? `**Para mantener la energía durante el día:**\n- Come comidas equilibradas cada 3-4 h con carbohidratos + proteína + grasas saludables\n- Incluye carbohidratos complejos: avena, arroz integral, batata\n- Mantente hidratado: al menos 2-3 litros de agua diarios\n\n`
        : `**For sustained energy throughout the day:**\n- Eat balanced meals every 3-4 hours with carbs + protein + healthy fats\n- Include complex carbs: oats, brown rice, sweet potatoes\n- Stay hydrated: at least 2-3 liters of water daily\n\n`;
    }

    // ── Stress / anxiety ──────────────────────────────────────────────────────
    if (profile.mentalState === 'stressed' || profile.mentalState === 'anxious') {
      recommendation += es
        ? `**Nutrición para el estrés:**\n- Alimentos ricos en magnesio: espinacas, almendras, chocolate negro\n- Omega-3: salmón, semillas de lino, nueces\n- Evita el exceso de cafeína y azúcar, que pueden aumentar la ansiedad\n\n`
        : `**Nutrition for stress management:**\n- Magnesium-rich foods: spinach, almonds, dark chocolate\n- Omega-3 foods: salmon, flax seeds, walnuts\n- Avoid excess caffeine and sugar which can increase anxiety\n\n`;
    }

    // ── Poor / average physical state ─────────────────────────────────────────
    if (profile.physicalState === 'poor' || profile.physicalState === 'average') {
      recommendation += es
        ? `**Para mejorar tu condición física:**\n- Prioriza alimentos densos en nutrientes: verduras, frutas, cereales integrales\n- Asegura un sueño adecuado e hidratación\n- Combina una progresión gradual del ejercicio con una nutrición adecuada\n\n`
        : `**To improve your physical condition:**\n- Focus on nutrient-dense foods: vegetables, fruits, whole grains\n- Ensure adequate sleep and hydration\n- Combine a gradual exercise progression with proper nutrition support\n\n`;
    }

    // ── BMI note ──────────────────────────────────────────────────────────────
    if (bmi < 18.5 || bmi > 30) {
      const bmiRounded = Math.round(bmi * 10) / 10;
      recommendation += es
        ? `**Tu IMC es ${bmiRounded}.** ${bmi < 18.5 ? 'Estás por debajo del peso recomendado — considera aumentar la ingesta calórica de forma progresiva.' : 'Estás por encima del rango saludable — un déficit calórico moderado y actividad física regular pueden ayudar.'}\n\n`
        : `**Your BMI is ${bmiRounded}.** ${bmi < 18.5 ? 'You are underweight — consider gradually increasing your caloric intake.' : 'You are above the healthy range — a moderate caloric deficit and regular physical activity can help.'}\n\n`;
    }

    // ── Fallback general advice ───────────────────────────────────────────────
    if (!recommendation) {
      recommendation = es
        ? `Basándonos en tu perfil (${profile.weight} kg, ${profile.height} cm, actividad ${profile.activityLevel}), aquí tienes una guía general:\n\n`
        : `Based on your profile (${profile.weight} kg, ${profile.height} cm, ${profile.activityLevel} activity), here are general guidelines:\n\n`;

      recommendation += es
        ? `- **Calorías diarias:** ~${Math.round(tdee)} kcal\n- **Proteína:** ${proteinGrams} g/día\n- **Tu meta:** ${profile.goals}\n\nRecuerda:\n- Bebe suficiente agua\n- Come alimentos integrales siempre que sea posible\n- Mantén horarios de comida regulares\n- Observa cómo te sientes y ajusta según sea necesario`
        : `- **Daily calories:** ~${Math.round(tdee)} kcal\n- **Protein:** ${proteinGrams} g/day\n- **Your goal:** ${profile.goals}\n\nRemember to:\n- Drink plenty of water\n- Eat whole foods when possible\n- Maintain consistent meal times\n- Monitor how you feel and adjust accordingly`;
    }

    return recommendation;
  }
}
