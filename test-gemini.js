import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyA8x88fIiuUrgdXkJ0jgEL0cQU7o3Z_WS0";
console.log("Simulating exact Travel Generation prompt...");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json"
  }
});

const FINAL_PROMPT = 'Generate a travel plan for Delhi for 15 days for a family with a Luxury budget. Return the response in JSON format with the following keys: "tripSummary", "hotels" (array of {name, address, price, imageUrl, rating, description}), and "itinerary" (array of {day, plan: array of {time, placeName, placeDetails, imageUrl, ticketPricing, rating, timeToTravel}}).';

async function run() {
  try {
    const result = await model.generateContent(FINAL_PROMPT);
    const text = result.response.text();
    console.log("SUCCESS!");
    console.log("Response text length:", text.length);
    console.log("Parsing test...");
    const parsed = JSON.parse(text);
    console.log("Parsed keys:", Object.keys(parsed));
    console.log("Sample tripSummary:", parsed.tripSummary);
  } catch (error) {
    console.error("FAILED!");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Full Error Details:", error);
  }
}

run();
