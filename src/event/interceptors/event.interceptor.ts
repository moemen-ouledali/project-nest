import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class EventInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((event) => this.transformEvent(event));
        }

        return this.transformEvent(data);
      }),
    );
  }

  private transformEvent(event: any) {
    if (event && event.available === false) {
      delete event.capacity;
      event.status = 'indisponible';
    }
    return event;
  }
}