import * as path from 'path';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'typeorm';

import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';

import { VehiclesController } from './vehicles/vehicles.controller';
import { VehiclesService } from './vehicles/vehicles.service';
import { VehiclesModule } from './vehicles/vehicles.module';

import { User } from './entities/Users.entity';
import { Vehicle } from './entities/Vehicles.entity';
import { Brand } from './entities/VehicleBrands.entity';
import { Model } from './entities/VehicleModels.entity';
import { VehicleTypes } from './entities/VehicleTypes.entity';
import { ScheduledMeets } from './entities/ScheduledMeets.entity';
import { Photo } from './entities/Photo.entity';
@Module({
  imports: [
    UsersModule,
    VehiclesModule,
    RouterModule.register([{ path: 'users', module: UsersModule }]),
    RouterModule.register([{ path: 'vehicles', module: VehiclesModule }]),
    // TypeOrmModule.forFeature([User, Vehicle]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '5GES85RJFFULX',
      database: 'blackoutdatabase',
      // entities: [path.join(__dirname, 'src/*.entity{.ts,.js}')],
      entities: [
        User,
        Vehicle,
        Brand,
        Model,
        VehicleTypes,
        ScheduledMeets,
        Photo,
      ],
      synchronize: true,
      retryAttempts: 10,
      autoLoadEntities: true,
      cache: true,
    }),
  ],
  controllers: [AppController, UsersController, VehiclesController],
  providers: [AppService, UsersService, VehiclesService],
})
export class AppModule {
  constructor(private connection: Connection) {
    this.connection.synchronize();
  }
}
