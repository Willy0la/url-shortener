import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'src/dtos/auth-dto/signup.dto';
@Injectable()
export class BaseService {
  private readonly logger = new Logger(BaseService.name);

  constructor(
    @InjectModel(User.name)
    private readonly baseModel: Model<UserDocument>,
  ) {
    this.logger.log('BaseModel initialised');
  }

  async findUser(
    userName: string,
    email: string,
  ): Promise<UserDocument | null> {
    return await this.baseModel.findOne({
      $or: [{ userName }, { email }],
      deletedAt: null,
    });
  }
  async hashPassword(
    password: string,
    pinCode: string,
  ): Promise<[string, string]> {
    return await Promise.all([
      bcrypt.hash(password, 12),
      bcrypt.hash(pinCode, 12),
    ]);
  }

  async createUser(
    dto: SignUpDto,
    hashPassword: string,
    hashPinCode: string,
    session: ClientSession,
  ): Promise<UserDocument> {
    const [newUser] = await this.baseModel.create(
      [
        {
          ...dto,
          password: hashPassword,
          pinCode: hashPinCode,
        },
      ],
      { session },
    );
    return newUser;
  }
}
