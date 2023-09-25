import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('BASIC')
@Controller()
export class AppController {
  @Get()
  healthCheck(): string {
    return 'green';
  }
}
