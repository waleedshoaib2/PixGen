import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
const natural: any = require('natural');
import { Multer } from 'multer';

@Injectable()
export class PdfService {
  async extractTextFromPdf(file: Express.Multer.File): Promise<any> {
    try {
      const pdfData = await pdfParse(file.buffer);
      const text = pdfData.text;
      const cleanedText = this.cleanExtractedText(text);
      const sections = this.splitIntoSections(cleanedText);

      return sections;
    } catch (error) {
      throw new Error('Error extracting text from PDF');
    }
  }

  private cleanExtractedText(text: string): string {
    return text
      .replace(/\s*\d+\s*$/gm, '') 
      .replace(/\[.*?\]/g, '') 
      .replace(/\s+/g, ' ') 
      .trim();
  }

  private splitIntoSections(text: string): Record<string, string> {
    const sections = {};
    const sectionTitles = [
      'abstract', 'introduction', 'methods', 'results', 'discussion', 'conclusion',
      'references', 'acknowledgements', 'related work', 'future work'
    ];
    const sectionRegex = new RegExp(`(${sectionTitles.join('|')})[:\\s]*`, 'i');
    let currentSection = 'unclassified';
    sections[currentSection] = '';

    const tokenizer = new natural.SentenceTokenizer();
    const sentences = tokenizer.tokenize(text);

    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      const matchedHeader = trimmedSentence.match(sectionRegex);

      if (matchedHeader) {
        currentSection = matchedHeader[0].toLowerCase();
        if (!sections[currentSection]) {
          sections[currentSection] = '';
        }
      }
      
      sections[currentSection] += trimmedSentence + ' ';
    });


    for (const section in sections) {
      sections[section] = sections[section].trim();
    }

    return sections;
  } 
}








