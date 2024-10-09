import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PromptService } from '../prompt/prompt.service';
import { Express } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly promptService: PromptService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 }, // Set a limit of 5MB for the file size
    fileFilter: (req, file, callback) => {
      if (file.mimetype !== 'application/pdf') {
        return callback(new BadRequestException('Only PDF files are allowed'), false);
      }
      callback(null, true);
    },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Process the uploaded PDF with the Gemini API
    return await this.promptService.processPdfWithGemini(file.buffer);
  }
}



