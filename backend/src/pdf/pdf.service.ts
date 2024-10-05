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

      // Clean the extracted text
      const cleanedText = this.cleanExtractedText(text);

      // Segment the cleaned text into sections
      const sections = this.splitIntoSections(cleanedText);

      return sections;
    } catch (error) {
      throw new Error('Error extracting text from PDF');
    }
  }

  private cleanExtractedText(text: string): string {
    // Remove unnecessary characters, page numbers, and references
    return text
      .replace(/\s*\d+\s*$/gm, '') // Removes page numbers at the end of lines
      .replace(/\[.*?\]/g, '') // Removes in-line references like [1], [2], etc.
      .replace(/\s+/g, ' ') // Normalizes excessive spaces
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

    // Tokenize text into sentences
    const tokenizer = new natural.SentenceTokenizer();
    const sentences = tokenizer.tokenize(text);

    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      const matchedHeader = trimmedSentence.match(sectionRegex);

      if (matchedHeader) {
        // If a section header is found, set it as the current section
        currentSection = matchedHeader[0].toLowerCase();
        if (!sections[currentSection]) {
          sections[currentSection] = ''; // Initialize an empty string for the section content if not exist
        }
      }
      // Append sentence to the current section
      sections[currentSection] += trimmedSentence + ' ';
    });

    // Trim extra spaces from the section content
    for (const section in sections) {
      sections[section] = sections[section].trim();
    }

    return sections;
  } 
}








