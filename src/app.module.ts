import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';
import { PrismaModule } from './prisma/prisma.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { ProjectService } from './project/project.service';
import { ProjectModule } from './project/project.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminsModule } from './admins/admins.module';
import { MultisigModule } from './multisig/multisig.module';
import { VendorModule } from './vendor/vendor.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
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
    VouchersModule,
    ProjectModule,
    DashboardModule,
    AdminsModule,
    MultisigModule,
    VendorModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProjectService, BeneficiaryModule],
})
export class AppModule {}
