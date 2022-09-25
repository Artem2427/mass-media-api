import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as Hogan from 'hogan.js';
import * as path from 'path';
import { SOMETHING_GO_WRONG } from './errors/errors';

import { SendEmailInfoInterface } from './types/send-email.interface';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendLetter(infoObject: SendEmailInfoInterface): void {
    try {
      var template = fs.readFileSync(
        path.resolve(__dirname, infoObject.filePath),
        {
          encoding: 'utf-8',
          flag: 'r',
        },
      );

      var compiledTemplate = Hogan.compile(template);

      this.mailerService
        .sendMail({
          from: `"Sity News" <${process.env.SMTP_USER}`,
          to: infoObject.to,
          subject: infoObject.subject,
          html: compiledTemplate.render(infoObject.context),
        })
        .then((r) => {
          console.log(r, 'Email is sent');
        })
        .catch((e) => {
          console.log(e, 'Error sending email');
        });
    } catch (error) {
      throw new HttpException(
        SOMETHING_GO_WRONG,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
