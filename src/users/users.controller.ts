import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/Users.model';
@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/get/all')
  @ApiResponse({
    status: 200,
    description: 'Get an array of users',
    type: User,
    isArray: true,
  })
  @HttpCode(200)
  async getHello(@Param() params): Promise<any> {
    const data = await this.userService.findAll();
    return data;
  }

  @Post('/create')
  @ApiResponse({
    status: 200,
    description: 'Create an user',
    type: User,
    isArray: true,
  })
  @HttpCode(200)
  async createUser(@Body() body) {
    return await this.userService.createOne(body);
  }
  @Get('/find/:id')
  @ApiResponse({
    status: 200,
    description: 'Return an user based on search ID',
    type: User,
  })
  @HttpCode(200)
  async findUser(@Param('id') id: string): Promise<any> {
    return this.userService.findOne(id);
  }

  @Post('/login')
  @ApiResponse({
    status: 200,
    description: 'Return an user based on search ID',
    type: User,
  })
  @HttpCode(200)
  async signIn(@Body() user) {
    return this.userService.signIn(user);
  }

  @Post('/signup')
  @ApiResponse({
    status: 200,
    description: 'Return an user based on search ID',
    type: User,
  })
  @HttpCode(200)
  async signUp(@Body() body) {
    return this.userService.createOne(body);
  }
}
