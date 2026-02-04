import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { message: 'Hello from Pepeland Pack Wiki Backend' };
  }
}
