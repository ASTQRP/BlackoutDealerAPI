import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Brand } from 'src/entities/VehicleBrands.model';
import { IResponseMessage } from '../interfaces/response.interface';

@Injectable()
export class BrandsService {
  getVehicleDataParams: object[];

  constructor(
    @InjectModel(Brand)
    private brandModel: typeof Brand,
  ) {
    //NOTE: DEFINE this.getVehicleDataParams with the data we want to query from brand model example at Vehicle.service.ts
  }

  async getAll() {
    const vehicles = await this.brandModel.findAll({
      include: this.getVehicleDataParams,
    });

    return vehicles;
  }

  async findBrandById(id: string) {
    const vehicle = await this.brandModel
      .findOne({
        where: { BrandID: id },
        include: this.getVehicleDataParams,
      })
      .then(async (vehicle) => {
        return vehicle;
      });

    return vehicle;
  }
  async removeOne(id: string): Promise<IResponseMessage> {
    const brand = await this.findBrandById(id);
    const message: IResponseMessage = {
      code: 403,
      message: 'Brand successfully removed',
    };
    if (brand != null) {
      await brand.destroy();
    } else {
      message.message = 'This brand does not exist!';
    }
    return message;
  }
  async insertVehicle(brand: Brand) {
    try {
      const message: IResponseMessage = {
        code: 200,
        message: 'Brand successfully added',
      };
      const result = await this.brandModel.create({
        BrandID: 0,
        BrandCode: brand.BrandName.toUpperCase(),
        BrandName: brand.BrandName,
      });

      return message;
    } catch (error) {
      console.log(error);
    }
  }
}
