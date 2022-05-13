import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from './entities/Users.model';
import { Vehicle } from './entities/Vehicles.model';
import { Brand } from './entities/VehicleBrands.model';
import { VehicleModel } from './entities/VehicleModels.model';
import { VehicleTypes } from './entities/VehicleTypes.model';
import { ScheduledMeet } from './entities/ScheduledMeets.model';
import { Photo } from './entities/Photo.model';

import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { ModelsModule } from './models/models.module';
import { VehicleTypesModule } from './vehicletypes/vehicletypes.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PhotosModule } from './photos/photos.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import configuration from './config/configuration';
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'blackout-dealer-database.ck4xhi6sphki.us-east-1.rds.amazonaws.com',
      username: 'admin',
      password: 'NOno11--',
      port: 3306,
      database: 'blackoutdb',
      models: [
        Brand,
        VehicleModel,
        VehicleTypes,
        User,
        Vehicle,
        ScheduledMeet,
        Photo,
      ],
      // autoLoadModels: true,
      // logQueryParameters: false,
      // logging: true,
      // synchronize: true,
      // sync: {
      //   force: true,
      // },
    }),
    UsersModule,
    VehiclesModule,
    PhotosModule,
    AuthModule,
    BrandsModule,
    ModelsModule,
    VehicleTypesModule,
    RouterModule.register([
      { path: 'users', module: UsersModule },
      { path: 'vehicles', module: VehiclesModule },
      { path: 'vehicletypes', module: VehicleTypesModule },
      { path: 'photos', module: PhotosModule },
      { path: 'brands', module: BrandsModule },
      { path: 'models', module: ModelsModule },
      { path: '', module: AppModule },
    ]),
  ],
})
export class AppModule {}
