import { Module } from '@nestjs/common';
import { UserModule } from '@app/user/user.module';

import { PrismaModule } from '@app/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot({isGlobal: true})],
})
export class AppModule {}
