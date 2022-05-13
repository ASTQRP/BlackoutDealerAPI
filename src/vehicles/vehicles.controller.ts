import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Vehicle } from 'src/entities/Vehicles.model';

@ApiTags('Vehicles')
@Controller()
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  @Get('/get/all')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Vehicle,
    isArray: true,
  })
  @HttpCode(200)
  async getAll(@Param() params): Promise<any> {
    const data = await this.vehicleService.getAll();
    return data;
  }

  @Post('/create')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Vehicle,
  })
  @HttpCode(200)
  async createVehicle(@Param() params, @Body() vehicle): Promise<any> {
    let savedCar = await this.vehicleService.insertVehicle(vehicle);
    return savedCar;
  }

  @Get('/get/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Vehicle,
  })
  @HttpCode(200)
  async getVehicle(@Param('id') id: string): Promise<any> {
    let data = this.vehicleService.findVehicleBy(id);
    return data;
  }

  @Get('/get/category/:categoryId')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Vehicle,
  })
  @HttpCode(200)
  async getVehicleByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<any> {
    let vehicles: Vehicle[];

    vehicles = await this.vehicleService
      .findVehicleByCategory(categoryId)
      .then((response) => response);

    return vehicles;
  }

  @Post('/remove/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Vehicle,
  })
  @HttpCode(200)
  async removeVehicle(@Param('id') id: string): Promise<any> {
    return this.vehicleService.removeOne(id);
  }

  @Get('/get/all/s3')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Vehicle,
  })
  @HttpCode(200)
  async getS3Objects(): Promise<any> {
    let vehicles: Vehicle[];

    vehicles = await this.vehicleService
      .getAllS3Objects()
      .then((response) => response);

    return vehicles;
  }
}
