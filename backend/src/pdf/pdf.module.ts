import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { PromptModule } from '../prompt/prompt.module'; 

@Module({
  controllers: [PdfController],
  imports: [PromptModule],
  providers: [PdfService],
})
export class PdfModule {}
