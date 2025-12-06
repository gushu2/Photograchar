/**
 * SIMULATION SERVICE
 * 
 * Since the API Key requirement has been removed, this service simulates 
 * the behavior of a Face Recognition AI.
 * 
 * It allows the UI to function fully (scanning, progress bars, results)
 * without sending data to an external server.
 */

/**
 * Compares a user's selfie with a candidate image locally.
 * Returns a simulated match result.
 */
export const compareFaces = async (selfieBase64: string, candidateBase64: string): Promise<{ match: boolean; confidence: number }> => {
  
  // 1. Simulate Network/Processing Delay (0.5s to 1.5s)
  // This makes the scanning bar in the UI look realistic.
  const delay = 500 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    // 2. Mock Matching Logic
    // In a real local implementation, we would use a library like face-api.js here.
    // For this template to work out-of-the-box without heavy model downloads:
    
    // We generate a result based on the length of the base64 string.
    // This ensures that the result is deterministic (same photo always gives same result)
    // but feels random enough for testing multiple photos.
    const magicNumber = candidateBase64.length % 100;

    // Simulate a 30% match rate so the user can see both "Match" and "No Match" UI states.
    const isMatch = magicNumber > 70; 

    // Calculate a fake confidence score
    const confidence = isMatch 
      ? 85 + (Math.random() * 14) // High confidence for matches (85-99%)
      : 10 + (Math.random() * 40); // Low confidence for non-matches

    return {
      match: isMatch,
      confidence: confidence
    };

  } catch (error) {
    console.error("Error in simulation:", error);
    return { match: false, confidence: 0 };
  }
};