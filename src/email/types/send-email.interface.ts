export interface SendEmailInfoInterface {
  from?: string;
  to: string[] | string;
  filePath: string;
  subject: string;
  context: Context;
}

export interface Context {
  [key: string]: any;
}
