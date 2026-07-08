import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { successResponse } from 'src/ApiResponse/auth.apiresponse';
import { BaseService } from 'src/base/base.service';
import { SignUpDto } from 'src/dtos/auth-dto/signup.dto';
import { SanitizedUser, userSanitizer } from './sanitizer/user.sanitizer';
import { SignInDto } from 'src/dtos/auth-dto/signin.dto';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  sub: unknown;
  userName: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly maxTry = 5;
  private readonly lockedOut = 15 * 60 * 1000;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly baseService: BaseService,
    private readonly jwtService: JwtService,
  ) {
    this.logger.log('AuthService has been initialized');  
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
          const findUser = await this.baseService.findUser(userName, email);
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
  async login(dto: SignInDto) {
    const { identifier, password, pinCode } = dto;
    const user = await this.baseService.findUserByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    await user.save();
    if (user.lockedUntil) {
      throw new UnauthorizedException(
        'Account is temporarily locked. Please try again later',
      );
    }

    let isValid = false;
    if (password) {
      isValid = await bcrypt.compare(password, user.password);
    } else if (pinCode) {
      isValid = await bcrypt.compare(pinCode, user.pinCode);
    }

    if (!isValid) {
      user.retry++;

      if (user.retry >= this.maxTry) {
        user.lockedUntil = new Date(Date.now() + this.lockedOut);
        user.retry = 0;
      }
      await user.save();
      throw new UnauthorizedException('Invalid credentials');
    }
    user.retry = 0;
    await user.save();
    const payload = {
      sub: user._id,
      userName: user.userName,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);
    const sanitized = userSanitizer(user);

    return successResponse('User logged in ', {
      user: sanitized,
      token,
    });
  }
}
