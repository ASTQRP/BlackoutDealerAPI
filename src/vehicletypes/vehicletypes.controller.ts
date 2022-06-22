import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { VehicleTypesService } from './vehicletypes.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VehicleTypes } from 'src/entities/VehicleTypes.model';

@ApiTags('Vehicle Types')
@Controller()
export class VehicleTypesController {
  constructor(private readonly vehicleTypesService: VehicleTypesService) {}

  @Get('/get/all')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleTypes,
    isArray: true,
  })
  @HttpCode(200)
  async getAll(): Promise<any> {
    const data = await this.vehicleTypesService.getAll();

    return data;
  }

  @Post('/create')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleTypes,
  })
  @HttpCode(200)
  async createVehicle(@Body() vehicle): Promise<any> {
    return this.vehicleTypesService.insertVehicle(vehicle);
  }

  @Get('/get/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleTypes,
  })
  @HttpCode(200)
  async getVehicle(@Param('id') id: string): Promise<any> {
    return this.vehicleTypesService.findModelById(id);
  }

  @Post('/remove/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleTypes,
  })
  @HttpCode(200)
  async removeVehicle(@Param('id') id: string): Promise<any> {
    return this.vehicleTypesService.removeOne(id);
  }

  @Get('/get/brand/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: VehicleTypes,
  })
  @HttpCode(200)
  async getModelsByBrand(@Param('id') id: string): Promise<any> {
    return this.vehicleTypesService.getModelsByBrand(id);
  }
}
