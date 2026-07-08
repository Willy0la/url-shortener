import { Module } from '@nestjs/common';
import { BaseService } from './base.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/users.schema';
import { JwtStrategy } from 'src/Strategy/jwt.strategy';
import { Url, UrlSchema } from 'src/url-short/url.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Url.name, schema: UrlSchema },
    ]),
  ],
  providers: [BaseService, JwtStrategy],
  exports: [BaseService, JwtStrategy],
})
export class BaseModule {}
