import { Controller, Post, Body } from '@nestjs/common';
import { PromptService } from './prompt.service';

@Controller('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post('enhance')
  async enhancePrompt(@Body() body: { prompt: string; style: string }): Promise<any> {

    console.log(body)
    const { prompt, style } = body;

    const enhancedPrompt = await this.promptService.enhancePrompt(prompt, style);

    return enhancedPrompt;
  }
}
