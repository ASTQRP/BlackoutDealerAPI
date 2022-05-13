import { Injectable } from '@nestjs/common';
import { Vehicle } from '../entities/Vehicles.model';
import { InjectModel } from '@nestjs/sequelize';
import { VehicleModel } from 'src/entities/VehicleModels.model';
import { Brand } from 'src/entities/VehicleBrands.model';
import { VehicleTypes } from 'src/entities/VehicleTypes.model';

import { IResponseMessage } from '../interfaces/response.interface';
import { PhotosService } from 'src/photos/photos.service';
import { Photo } from 'src/entities/Photo.model';
import { S3Service } from 'src/aws/s3.controller';
import { Error } from 'sequelize';
import { any } from 'joi';
@Injectable()
export class VehiclesService {
  photoService: PhotosService;
  getVehicleDataParams: object[];
  filesService: S3Service;
  constructor(
    @InjectModel(Vehicle)
    private vehicleModel: typeof Vehicle,
  ) {
    this.photoService = new PhotosService(Photo);
    this.getVehicleDataParams = [
      {
        model: Brand,
        required: true,
        attributes: ['BrandName'],
      },
      {
        model: VehicleModel,
        required: true,
        attributes: ['ModelName'],
      },
      {
        model: VehicleTypes,
        required: true,
      },
      {
        model: Photo,
        required: true,
      },
    ];
    this.filesService = new S3Service();
  }

  async getAll() {
    type reponse = {
      data: any;
      message: string;
    };
    let vehicles: Vehicle[];

    try {
      vehicles = await this.vehicleModel
        .findAll({
          include: this.getVehicleDataParams,
        })
        .then((vehiclesFound: Vehicle[]) => {
          return vehiclesFound;
        })
        .catch((err) => {
          console.log('====================================');
          console.log(err);
          console.log('====================================');
          return [];
        });
    } catch (error) {}

    return vehicles;
  }
  async findVehicleBy(id: string) {
    const vehicle = await this.vehicleModel
      .findOne({
        where: { VehicleID: id },
        include: this.getVehicleDataParams,
      })
      .then(async (vehicle) => {
        if (vehicle) {
          vehicle.Photos = await this.photoService.findMultiplePhotos(id);
        } else {
          vehicle.Photos = [];
        }
        return vehicle;
      });

    return vehicle;
  }
  async findVehicleByCategory(categoryID: string) {
    try {
      let foundVehicles: Vehicle[] = [];

      if (categoryID != '2') {
        await this.vehicleModel
          .findAll({
            where: { TypeID: categoryID },
            include: this.getVehicleDataParams,
          })
          .then((data) => {
            foundVehicles = data;
          })
          .catch((err) => {
            return {};
          });
      } else {
        await this.vehicleModel
          .findAll({
            where: { TypeID: categoryID, VehicleOnRent: '1' },
            include: this.getVehicleDataParams,
          })
          .then((data) => {
            foundVehicles = data;
          })
          .catch((err) => {
            console.log(err);
            return {};
          });
      }

      return foundVehicles;
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
  async removeOne(id: string): Promise<IResponseMessage> {
    const vehicle = await this.findVehicleBy(id);
    const message: IResponseMessage = {
      code: 200,
      message: 'Vehicle successfully removed',
    };
    if (vehicle != null) {
      await vehicle.destroy();
    } else {
      message.message = 'This vehicle does not exist!';
    }
    return message;
  }
  async insertVehicle(vehicle: Vehicle) {
    const message: IResponseMessage = {
      code: 200,
      message: 'Vehicle successfully added',
    };

    try {
      let vehicleIdentifier = `BK-${vehicle.VIN.slice(vehicle.VIN.length - 6)}`;

      const result = await this.vehicleModel.create({
        VehicleID: vehicle.VehicleID,
        VehicleYear: vehicle.VehicleYear,
        VehiclePrice: vehicle.VehiclePrice,
        VehicleOnRent: vehicle.VehicleOnRent,
        VehicleDescription: vehicle.VehicleDescription,
        TypeID: vehicle.TypeID,
        BrandID: vehicle.BrandID,
        ModelID: vehicle.ModelID,
        Photos: vehicle.Photos,
        VIN: vehicle.VIN,
        Identifier: vehicleIdentifier,
      });
      console.log(result);

      await vehicle.Photos.map(async (photo: any, i: number) => {
        let fileIdentifier: string = `${vehicle.VIN}-${result.VehicleID}-${i}`;

        await this.filesService
          .S3Upload(photo, fileIdentifier)
          .then(async (S3Response: string) => {
            await this.photoService.insertPhoto(S3Response, result.VehicleID);
          });
      });
    } catch (error: any) {
      message.message =
        error.name == 'SequelizeUniqueConstraintError'
          ? 'Codigo VIN Duplicado'
          : error.name;
    }
    return message;
  }
  async getAllS3Objects() {
    let data = this.filesService
      .S3GetAllFiles()
      .then(async (S3Response: any) => {
        return S3Response;
      });

    return data;
  }
}
