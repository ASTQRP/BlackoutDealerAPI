import { Column, IsEmail, Model, Table } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';

@Table({ createdAt: false, updatedAt: false })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  UserID: number;

  @Column({ type: DataType.STRING })
  FirstName: string;

  @Column({ type: DataType.STRING })
  LastName: string;

  @Column({ type: DataType.STRING })
  Password: string;

  @IsEmail
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  MainEmail: string;

  @IsEmail
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  RecoveryEmail: string;

  @Column({ type: DataType.BOOLEAN })
  IsActive: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  IsAdmin: boolean;
}
