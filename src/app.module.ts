import { Module } from '@nestjs/common';
import { UserModule } from '@app/user/user.module';

import { PrismaModule } from '@app/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';


import { MiddlewareConsumer } from '@nestjs/common';
import LogsMiddleware from '@app/utils/logs.middleware';

@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot({isGlobal: true})],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogsMiddleware)
      .forRoutes('*');
  }
}
