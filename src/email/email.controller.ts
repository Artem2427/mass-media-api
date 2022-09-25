import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import fs from 'fs';

import * as Hogan from 'hogan.js';

@Controller()
export class EmailController {
  @Get('preview')
  getActivateLetter(@Res() response: Response) {
    var template = fs.readFileSync('./views/activationEmail.hjs', 'utf-8');
    var compiledTemplate = Hogan.compile(template);
  }
}
