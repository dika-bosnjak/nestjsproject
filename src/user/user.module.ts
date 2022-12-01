import { Module } from '@nestjs/common';
import { UserController } from '@app/user/user.controller';
import { UserService } from '@app/user/user.service';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from '@app/user/strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})

export class UserModule {}
