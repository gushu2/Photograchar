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
 * Generates a simple hash from a string to create deterministic "random" results.
 * This ensures the same photo always produces the same match result.
 */
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Compares a user's selfie with a candidate image locally.
 * Returns a simulated match result.
 */
export const compareFaces = async (selfieBase64: string, candidateBase64: string): Promise<{ match: boolean; confidence: number }> => {
  
  // 1. Simulate Network/Processing Delay (300ms to 800ms) for realism
  const delay = 300 + Math.random() * 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    // 2. Deterministic Matching Logic
    // We combine the selfie and candidate strings to create a unique pair hash.
    // This simulates the AI looking at "Features".
    
    // We take a slice of the strings to avoid heavy computation on massive Base64 strings
    const selfieFeature = selfieBase64.substring(selfieBase64.length - 500);
    const candidateFeature = candidateBase64.substring(candidateBase64.length - 500);
    
    const combinedHash = simpleHash(selfieFeature + candidateFeature);
    
    // Normalize hash to 0-100
    const matchScore = combinedHash % 100;

    // We set a threshold. In this simulation, roughly 20% of photos will match.
    // Adjust '80' to make matches more or less frequent.
    const isMatch = matchScore > 80; 

    // Calculate a confidence score
    const confidence = isMatch 
      ? 85 + (matchScore % 15) // 85-99%
      : 10 + (matchScore % 60); // 10-70%

    return {
      match: isMatch,
      confidence: confidence
    };

  } catch (error) {
    console.error("Error in simulation:", error);
    return { match: false, confidence: 0 };
  }
};