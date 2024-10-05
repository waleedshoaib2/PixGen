import { Injectable, BadRequestException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class PromptService {
  private geminiClient;

  constructor() {
    this.geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Set API Key as an environment variable
  }

  async enhancePrompt(userPrompt: string, userStyle: string): Promise<any> {
    try {
      const model = this.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        You are an expert prompt engineer specializing in enhancing prompts for image generation using AI, particularly for creative tasks involving visual art. Your task is to enhance and refine the following user-provided prompt to make it as specific, vivid, and visually detailed as possible. Use best practices in prompt engineering to maximize clarity, specificity, and creativity. Additionally, incorporate the visual style specified by the user to guide the overall artistic direction of the prompt.

        Here are the instructions to follow:

        1. **Maintain Original Intent**: Preserve the core idea of the user-provided prompt while enhancing the level of detail, specificity, and visual clarity.

        2. **Add Context and Specific Elements**: Expand on the main subject by adding relevant context:
          - If the prompt describes a scene, include specific **visual elements** such as colors, textures, lighting conditions, and background features.
          - Consider **emotional tone** and **atmosphere** that the user might want, e.g., "mysterious", "serene", or "futuristic".

        3. **Incorporate User-Provided Visual Style**: Enhance the prompt based on the style chosen by the user. The styles may include:
          - **Cinematographic**: Add dramatic lighting and visual cues that evoke a film-like quality.
          - **Anime**: Use vibrant colors, exaggerated features, and fantastical details.
          - **Cyberpunk**: Integrate neon colors, futuristic cityscapes, and dystopian elements.
          - **HD/Realistic**: Make the scene highly detailed with realistic lighting, textures, and shadows.
          - **Watercolor/Impressionist**: Describe soft, flowing colors and abstract but emotive details.
          - If no specific style is mentioned, enhance the prompt to be visually rich without relying on a particular artistic genre.

        4. **Focus on Clarity**: Ensure that the enhanced prompt is clear, specific, and unambiguous.
          - Avoid abstract terms unless followed by specific examples (e.g., instead of "beautiful landscape," use "a vibrant green meadow with wildflowers under a clear blue sky").

        5. **Include Unique Details**: Add unique elements that could make the generated image stand out:
          - For characters: Describe their appearance, clothing, expression, and actions.
          - For settings: Describe the time of day, weather, and any noteworthy background elements (e.g., "an old cobblestone street in Paris at sunset").

        6. **Use Sensory Descriptions**: Where appropriate, include descriptions that appeal to the senses:
          - **Visual**: Colors, shapes, and lighting.
          - **Auditory**: Sounds that might be heard in the scene (e.g., "the hum of electric drones").
          - **Tactile**: Textures and feelings (e.g., "the cold, smooth stone surface of the castle walls").

        **User-Provided Prompt**: "${userPrompt}"

        **User-Selected Style**: "${userStyle}"

        **Instructions for the Response Format**:
        Please respond with the following format:

        {
          "enhancedPrompt": "A detailed version of the prompt, enhanced with specific visual elements, styles, and atmosphere. Ensure this is a vivid and specific enhancement of the original user-provided prompt.",
          "details": {
            "styleIncorporated": "${userStyle}",
            "addedElements": [
              "Key context added (e.g., environment details such as lush green hills, sunset lighting)",
              "Specific visual elements added (e.g., neon lights, futuristic structures, character descriptions)",
              "Atmospheric and sensory descriptions (e.g., mood, weather, time of day)"
            ]
          }
        }
      `;

      const result = await model.generateContent(prompt);
      console.log("the result is", result);

      // Extract the text from the response
      let responseText = result.response.candidates[0].content.parts[0].text;

      // Remove triple backticks and 'json' marker
      responseText = responseText.replace(/```json|```/g, '').trim();

      try {
        // Parse the cleaned response as JSON
        return JSON.parse(responseText);
      } catch (parseError) {
        throw new BadRequestException(`Invalid JSON response: ${responseText}. Error: ${parseError.message}`);
      }
      
    } catch (error) {
      throw new BadRequestException('Error generating enhanced prompt from Google Gemini AI');
    }
  }
}
