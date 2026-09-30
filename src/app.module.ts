import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

// SO this AppModule file is the root module files that all modules will be registered here
// for the configModule is a Nestjs's official module for managing environment vairables
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // setting isGlobal: true makes configService accessible everywhere in the project without need to import ConfigModule again
      expandVariables: true, // this section allows us to reference other environment variables from the .env file
    }),
    UsersModule,
  ],
})
export class AppModule {}
