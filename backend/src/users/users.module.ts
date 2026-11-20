import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeController } from './me.controller.js';
import { UserEntity, UserSchema } from './schemas/user.schema.js';
import { UsersRepository } from './users.repository.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }])],
  controllers: [MeController],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
