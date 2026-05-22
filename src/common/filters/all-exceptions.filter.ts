import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.message
      : 'Внутрішня помилка сервера';

    if (request.headers.accept?.includes('application/json')) {
      return response.status(status).json({ statusCode: status, message });
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      return response.redirect('/auth/login');
    }

    return response.status(status).render('error', {
      title: `${status} — Помилка`,
      statusCode: status,
      message,
      user: request['user'],
    });
  }
}
