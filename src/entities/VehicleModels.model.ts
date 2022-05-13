import {
  Column,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { Brand } from './VehicleBrands.model';

@Table({ modelName: 'Model', createdAt: false, updatedAt: false })
export class VehicleModel extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  ModelID: number;

  @Column
  ModelCode: string;

  @Column
  ModelName: string;

  @BelongsTo(() => Brand)
  Brand: Brand;
  @ForeignKey(() => Brand)
  BrandID: Brand;
}
