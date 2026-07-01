import { Module } from '@nestjs/common';
import { BaseService } from './base.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [BaseService],
  exports: [BaseService],
})
export class BaseModule {}
