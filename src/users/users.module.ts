import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // so this export here make the UsersService injectable to other modules
})
export class UsersModule {}
