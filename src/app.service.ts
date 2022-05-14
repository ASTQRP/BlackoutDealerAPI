import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class AppService {
  constructor() {}

  GetHelloWorld(): string {
    return 'Hello World!';
  }
}
