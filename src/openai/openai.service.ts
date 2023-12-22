import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OpenaiService {
  private readonly apiToken: string;
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({ apiKey: this.apiToken });
    this.apiToken = this.configService.get('OPENAI_API_KEY');
  }
  async sendImage(file: Express.Multer.File) {
    try {
      console.log('token', this.apiToken);
      const base64Image = file.buffer.toString('base64');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiToken}`,
      };
      const payload = {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Is this image an identity document?, response true o false',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      };
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        payload,
        { headers },
      );
      console.log('response', response.data.choices[0]);
      return response.data.choices[0];
    } catch (error) {
      console.log(error);
    }
  }
  async sendImageUrl(imageUrl: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Is this image an identity document?' },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });
    console.log(response.choices[0]);
  }
}
