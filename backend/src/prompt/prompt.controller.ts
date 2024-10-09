import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PromptService } from './prompt.service';
import { Express } from 'express';

@Controller('prompt')
export class PromptController {
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

    // Use the PromptService to process the uploaded PDF and get detailed analysis
    return await this.promptService.processPdfWithGemini(file.buffer);
  }
}
