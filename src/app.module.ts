import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule } from '@nestjs/config';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.ALGORAND_MAIL_PROVIDER,
        port: Number(process.env.ALGORAND_MAIL_PORT),
        secure: true,
        auth: {
          user: process.env.ALGORAND_MAIL_USER,
          pass: process.env.ALGORAND_MAIL_PASSWORD,
        },
      },
    }),
    BeneficiaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
