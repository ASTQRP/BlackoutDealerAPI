import {
  Controller,
  Request,
  Post,
  Response,
  HttpCode,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';

import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  Main(): string {
    let result = this.appService.GetHelloWorld();
    return result;
  }
}
