import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/Users.model';
import { IResponseMessage } from 'src/interfaces/response.interface';
//Encryption
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  private bcryptSaltRounds = 10;
  private bcryptSalt = '';
  private bcryptHash = '';

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }
  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
  async createOne(user: User): Promise<IResponseMessage> {
    const responseMessage: IResponseMessage = {
      code: 200,
      message: '',
    };
    try {
      const hashedPassword = await bcrypt.hash(
        user.Password,
        this.bcryptSaltRounds,
      );

      let userRegistered = await this.userModel
        .create({
          UserID: user.UserID,
          FirstName: `${user.FirstName} ${user.LastName}`,
          Password: hashedPassword,
          MainEmail: user.MainEmail,
          RecoveryEmail: user.RecoveryEmail,
          LastName: user.LastName,
          IsActive: user.IsActive,
        })
        .then((response) => {
          responseMessage.message = 'User successfully added';
        });

      return responseMessage;
    } catch (error) {
      //TODO: Move this to a dedicated function which gonna handle all the DB errors and "translate it" to natural language
      if (Array.isArray(error.errors)) {
        switch (error.errors[0].type) {
          case 'Validation error':
            responseMessage.message =
              'Email is not valid, check if it has "@" !';
            break;
          case 'unique violation':
            responseMessage.message = 'Recovery email is in use!';
            break;
        }
      } else {
        switch (error.parent.code) {
          case 'ER_DUP_ENTRY':
            responseMessage.message = 'Email in use!';
            break;
        }
      }
    }
    return responseMessage;
  }

  async signIn(userSignIn: any) {
    const message: IResponseMessage = {
      code: 200,
      message: 'User found, login in',
      data: null,
    };
    try {
      let foundUser = await this.userModel.findOne({
        attributes: [
          'UserID',
          'FirstName',
          'LastName',
          'MainEmail',
          'UserID',
          'Password',
        ],
        where: { MainEmail: userSignIn.email },
      });

      const doesMatch = await bcrypt.compare(
        userSignIn.password,
        foundUser.Password,
      );

      foundUser.Password = null;
      doesMatch == true
        ? (message.data = foundUser)
        : (message.message = 'User not found');
    } catch (error) {
      message.message = error.message;
    }
    return message;
  }
}
