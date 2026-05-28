import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY);

export const chatSession = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const PROMPT = "Generate a travel plan for Location: {location}, for {totalDays} days for {traveler} with a {budget} budget. Give a JSON output with hotels (name, address, price, rating) and itinerary (day-wise with time, place name, details, time to travel).";