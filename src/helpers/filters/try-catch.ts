import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { MESSAGE } from "../messages";
import { ReturnError } from "../responses";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error | string, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let msg: string;
    if (exception instanceof HttpException || exception instanceof Error) {
      msg = MESSAGE.SERVER_ERROR;
      console.log("Exception filter error: ", exception.message);
    } else {
      msg = String(exception || MESSAGE.SERVER_ERROR);
    }
    ReturnError(response, msg);
  }
}
