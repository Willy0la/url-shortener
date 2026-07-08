import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { BaseModule } from 'src/base/base.module';

@Module({
  imports: [BaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
