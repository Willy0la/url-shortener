import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { successResponse } from 'src/ApiResponse/auth.apiresponse';
import { BaseService } from 'src/base/base.service';
import { SignUpDto } from 'src/dtos/auth-dto/signup.dto';
import { SanitizedUser, userSanitizer } from './sanitizer/user.sanitizer';

interface JwtPayload {
  sub: unknown;
  userName: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly baseService: BaseService,
    private readonly jwtService: JwtService,
  ) {
    this.logger.log('AuthService has been initialized'); // Consider changing to AuthService
  }

  async createUser(dto: SignUpDto) {
    const { password, email, userName, pinCode } = dto;
    const session = await this.connection.startSession();

    try {
      const { payload, sanitizedUser } = await session.withTransaction(
        async (): Promise<{
          payload: JwtPayload;
          sanitizedUser: SanitizedUser;
        }> => {
          const findUser = await this.baseService.findUser(email, userName);
          if (findUser) {
            throw new BadRequestException('User already exists');
          }

          const [hashedPassword, hashedPincode] =
            await this.baseService.hashPassword(password, pinCode);

          const newUser = await this.baseService.createUser(
            dto,
            hashedPassword,
            hashedPincode,
            session,
          );

          return {
            payload: {
              sub: newUser._id,
              userName: newUser.userName,
              email: newUser.email,
            },
            sanitizedUser: userSanitizer(newUser),
          };
        },
      );

      const token = this.jwtService.sign(payload);
      return successResponse('User created successfully', {
        user: sanitizedUser,
        token,
      });
    } finally {
      if (session) {
        await session.endSession();
      }
    }
  }
}
