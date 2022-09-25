export interface SendEmailInfoInterface {
  to: string[] | string;
  filePath: string;
  subject: string;
  context: Context;
}

export interface Context {
  [key: string]: any;
}
