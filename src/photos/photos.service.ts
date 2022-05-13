import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Photo } from 'src/entities/Photo.model';
import { IResponseMessage } from '../interfaces/response.interface';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo)
    private photoModel: typeof Photo,
  ) {}

  async getAll() {
    return await this.photoModel.findAll();
  }
  async findPhotoBy(id: string | number) {
    const photo = await this.photoModel.findOne({ where: { VehicleID: id } });
    return photo;
  }
  async findMultiplePhotos(id: string | number) {
    return await this.photoModel.findAll({ where: { VehicleID: id } });
  }
  async removeOne(id: string): Promise<IResponseMessage> {
    const photo = await this.findPhotoBy(id);
    const message: IResponseMessage = {
      code: 200,
      message: 'Photo successfully removed',
    };

    photo.destroy();

    return message;
  }
  async insertPhoto(photo: string, vehicleID: number) {
    try {
      const message: IResponseMessage = {
        code: 200,
        message: 'Photo successfully added',
      };

      let photos = await this.photoModel
        .create({
          PhotoID: 0,
          PhotoUri: photo,
          VehicleID: vehicleID,
        })
        .then((result) => result);

      return photos;
    } catch (error) {
      console.log(error);
    }
  }
}
