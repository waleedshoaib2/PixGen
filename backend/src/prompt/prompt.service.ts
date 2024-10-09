import { Injectable, BadRequestException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PromptService {
  private geminiClient;
  private fileManager;

  constructor(private configService: ConfigService) {
    this.geminiClient = new GoogleGenerativeAI(this.configService.get<string>('GOOGLE_API_KEY'));
    this.fileManager = new GoogleAIFileManager(this.configService.get<string>('GOOGLE_API_KEY'));
  }

  async processPdfWithGemini(fileBuffer: Buffer): Promise<any> {
    try {
     const tempFileName = `temp-${uuidv4()}.pdf`;
      const tempFilePath = path.join(__dirname, '../../temp', tempFileName);

      fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
      fs.writeFileSync(tempFilePath, fileBuffer);
     const uploadResponse = await this.fileManager.uploadFile(tempFilePath, {
        mimeType: 'application/pdf',
        displayName: 'Uploaded Research Paper',
      });

      
      console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);

      const model = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const sections = ["Introduction", "Methods", "Results", "Conclusion"]; 
      const finalAnalysis = {};

      for (const section of sections) {
        const prompt = `
          You are an expert research paper analyst. Analyze the following section of a research paper and provide a detailed explanation, including:
          
          1. **Detailed Explanation**: Explain the core idea, objective, and findings of the section in depth. Cover all key concepts and describe their significance.
          
          2. **Key Insights**: Extract the most important insights from this section and explain why they are crucial to the research.

          3. **Detailed Explanations for Complex Terms**: Identify and explain any technical terms, methodologies, or advanced concepts that a non-expert might not understand.

          4. **Suggestions for Improvement**: Provide suggestions for improving the research, including alternative methods or additional experiments that could add value.

          5. **Tone and Contextual Analysis**: Describe the tone of the section and how it impacts the reader's understanding of the research.

          **Section Name**: ${section}
          **Content**: Provide a detailed breakdown of this section.

          Please return the response in the following JSON format:

          {
            "detailedExplanation": "Provide a comprehensive explanation of the section here.",
            "keyInsights": [
              "Insight 1: Description and significance.",
              "Insight 2: Description and significance."
            ],
            "complexExplanations": {
              "Technical Term 1": "Explanation of technical term and its relevance.",
              "Methodology 1": "Explanation of methodology and its purpose."
            },
            "suggestions": [
              "Suggestion 1: Possible improvement with reasoning.",
              "Suggestion 2: Additional experiments that could enhance the findings."
            ],
            "toneAnalysis": "Description of the tone and its effect."
          }
        `;

        try {
          const result = await model.generateContent([
            {
              fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
              },
            },
            { text: prompt },
          ]);
          let responseText = result.response.candidates[0].content.parts[0].text;
          responseText = responseText.replace(/```json|```/g, '').trim();

          try {
            finalAnalysis[section] = JSON.parse(responseText);
          } catch (parseError) {
            throw new BadRequestException(`Invalid JSON response for section ${section}: ${responseText}. Error: ${parseError.message}`);
          }

        } catch (error) {
          finalAnalysis[section] = {
            error: `Error processing section ${section}: ${error.message}`,
          };
        }
      }
      fs.unlinkSync(tempFilePath);
      return finalAnalysis;
    } catch (error) {
      throw new BadRequestException('Error processing PDF with Google Gemini AI: ' + error.message);
    }
  }
}
