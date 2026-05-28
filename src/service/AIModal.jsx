import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

export const chatSession = model.startChat({
  history: [],
});

// Resilient model list for high-availability fallbacks
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash"
];

export const generateTripWithFallback = async (prompt) => {
  let lastError = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`Attempting generation with model fallback: ${modelName}`);
      const fallbackModel = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json"
        }
      });
      
      const result = await fallbackModel.generateContent(prompt);
      const responseText = result.response.text();
      
      if (responseText && responseText.trim()) {
        console.log(`Success using model: ${modelName}`);
        return responseText;
      }
    } catch (err) {
      console.warn(`Model ${modelName} encountered an issue:`, err.message || err);
      lastError = err;
      // Cycle immediately to the next available model
      continue;
    }
  }

  throw lastError || new Error("All Gemini generative models are currently experiencing high demand. Please try again in a few moments.");
};