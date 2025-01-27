import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const port = (process.env.PORT || 3000);

  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('/v1/api');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Dealer API example')
    .setDescription('The Dealer API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.clear();
  console.log('====================================');
  console.log(`Server running on port ${port}`);
  console.log('====================================');
  await app.listen(port);
}

bootstrap();
