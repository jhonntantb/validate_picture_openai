import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.openaiService.sendImage(file);
  }

  @Post('url')
  sendUrl(@Body() body: { url: string }) {
    return this.openaiService.sendImageUrl(body.url);
  }
}
