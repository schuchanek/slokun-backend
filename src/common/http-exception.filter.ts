import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'internal_error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const ex = exception.getResponse();
      if (typeof ex === 'string') {
        message = ex;
      } else if (typeof ex === 'object' && (ex as any).message) {
        message = (ex as any).message;
      }
      code = (exception as any).name || 'http_error';
    } else if (exception && typeof exception === 'object' && (exception as any).message) {
      message = (exception as any).message;
    }

    res.status(status).json({ success: false, error: { code, message, path: req.url } });
  }
}
