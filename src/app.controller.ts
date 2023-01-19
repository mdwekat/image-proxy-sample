import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  @Header('Content-Type', 'image/jpeg')
  async getHello(): Promise<StreamableFile> {
    try {
      const request = this.httpService.get(
        'https://i.picsum.photos/id/701/200/300.jpg?hmac=gVWdD9Rh_J0iGXpXOJAN7MZpGPrpeHX_M5JwGGvTSsI',
        {
          // This part is very important
          responseType: 'arraybuffer',
        },
      );
      const res = await lastValueFrom(request);

      return new StreamableFile(Buffer.from(res.data, 'binary'), {
        type: 'image/jpeg',
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
