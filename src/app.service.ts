import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailerService) {}

  sendMail() {
    const message = `Forgot your password? If you didn't forget your password, please ignore this email!`;

    this.mailService.sendMail({
      from: 'Sushant Tripathee <sushant.rumsan@gmail.com>',
      to: 'sushanttripathee1154@gmail.com',
      subject: `How to Send Emails with Nodemailer`,
      text: message,
    });
  }
}