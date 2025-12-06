import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Compares a user's selfie with a candidate image using Gemini.
 * Returns a match result with confidence score.
 */
export const compareFaces = async (selfieBase64: string, candidateBase64: string): Promise<{ match: boolean; confidence: number }> => {
  try {
    // Helper to extract base64 data from Data URL
    const getBase64Data = (dataUrl: string) => {
      const parts = dataUrl.split(',');
      return parts.length > 1 ? parts[1] : dataUrl;
    };

    const selfieData = getBase64Data(selfieBase64);
    const candidateData = getBase64Data(candidateBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: selfieData,
            },
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: candidateData,
            },
          },
          {
            text: 'Compare the faces in these two images. Are they the same person? Return a JSON object with "match" (boolean) and "confidence" (number between 0 and 100).',
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            match: {
              type: Type.BOOLEAN,
              description: 'Indicates if the faces belong to the same person.',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score of the match (0-100).',
            },
          },
          required: ['match', 'confidence'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');

    return {
      match: result.match === true,
      confidence: typeof result.confidence === 'number' ? result.confidence : 0,
    };
  } catch (error) {
    console.error("Gemini face comparison error:", error);
    return { match: false, confidence: 0 };
  }
};