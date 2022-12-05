import { Module } from '@nestjs/common';
import { UserModule } from '@app/user/user.module';

import { PrismaModule } from '@app/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';


import { MiddlewareConsumer } from '@nestjs/common';
import { DocumentTypeModule } from '@app/document_type/document_type.module';
import { DocumentModule } from '@app/document/document.module';
import { PaymentModule } from './payment/payment.module';
import LogsMiddleware from '@app/utils/logs.middleware';

@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot({isGlobal: true}), DocumentTypeModule, DocumentModule, PaymentModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogsMiddleware)
      .forRoutes('*');
  }
}
