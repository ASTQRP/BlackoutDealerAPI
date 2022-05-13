import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { User } from '../entities/Users.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
