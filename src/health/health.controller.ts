import { Controller, Get } from '@nestjs/common';

import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check(): Promise<{ status: string; database: string }> {
    const dbStatus = await this.healthService.checkDatabase();
    return {
      status: 'OK',
      database: dbStatus ? 'UP' : 'DOWN',
    };
  }
}
