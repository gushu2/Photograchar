import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to extract MIME type from Data URL
 */
const getMimeType = (dataUrl: string): string => {
  try {
    const match = dataUrl.match(/^data:(.+);base64,/);
    return match ? match[1] : 'image/jpeg';
  } catch {
    return 'image/jpeg';
  }
};

/**
 * Compares a user's selfie with a candidate image to check for a facial match.
 */
export const compareFaces = async (selfieBase64: string, candidateBase64: string): Promise<{ match: boolean; confidence: number }> => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    return { match: false, confidence: 0 };
  }

  try {
    // Get MIME types before stripping headers
    const selfieMime = getMimeType(selfieBase64);
    const candidateMime = getMimeType(candidateBase64);

    // Strip headers if present (e.g., "data:image/png;base64,")
    const cleanSelfie = selfieBase64.split(',')[1] || selfieBase64;
    const cleanCandidate = candidateBase64.split(',')[1] || candidateBase64;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        match: { type: Type.BOOLEAN, description: "True if the person in the first image is present in the second image." },
        confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100." },
        reasoning: { type: Type.STRING, description: "Brief explanation of why it is or is not a match." }
      },
      required: ["match", "confidence"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using Flash for speed/efficiency
      contents: {
        parts: [
          { text: "You are an expert biometric verification AI. Compare the person in the FIRST image (reference selfie) with the people in the SECOND image (scene). Determine if the person from the selfie is present in the scene." },
          {
            inlineData: {
              mimeType: selfieMime,
              data: cleanSelfie
            }
          },
          {
            inlineData: {
              mimeType: candidateMime,
              data: cleanCandidate
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1, // Low temperature for more deterministic/analytical results
      }
    });

    let jsonStr = response.text || "{}";
    
    // Cleanup: Strip Markdown code blocks if the model includes them
    // Sometimes models return ```json ... ``` even with responseMimeType set
    jsonStr = jsonStr.replace(/```json\n?|```/g, "").trim();

    const result = JSON.parse(jsonStr);
    return result;

  } catch (error) {
    console.error("Error matching faces:", error);
    // In case of error, assume no match to be safe
    return { match: false, confidence: 0 };
  }
};