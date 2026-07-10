import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Types } from 'mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'src/dtos/auth-dto/signup.dto';
import { Url, UrlDocument } from 'src/url-short/url.schema';
import { CreateUrlDto } from 'src/dtos/url-dto/createUrl.dto';

@Injectable()
export class BaseService {
  private readonly logger = new Logger(BaseService.name);

  constructor(
    @InjectModel(User.name)
    private readonly baseModel: Model<UserDocument>,
    @InjectModel(Url.name) private readonly urlModel: Model<UrlDocument>,
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

  async findUserByIdentifier(identifier: string) {
    return await this.baseModel.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
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

  async getUserById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Id');
    }
    return this.baseModel.findById(id).select('-password -pinCode').exec();
  }

  async findUserUrl(id: string): Promise<UrlDocument | null> {
    return await this.urlModel.findById(id).exec();
  }
  async findShortCode(shortCode: string): Promise<UrlDocument | null> {
    return await this.urlModel.findOne({ shortCode, isActive: true });
  }

  async incrementClick(shortCode: string): Promise<void> {
    await this.urlModel.updateOne({ shortCode }, { $inc: { clickCount: 1 } });
  }
  async createUrlUser(
    userId: string,
    dto: CreateUrlDto,
    shortCode: string,
  ): Promise<UrlDocument> {
    const { originalUrl, expiresAt } = dto;
    return await this.urlModel.create({
      owner: userId,
      shortCode: shortCode,
      originalUrl: originalUrl,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });
  }
}
