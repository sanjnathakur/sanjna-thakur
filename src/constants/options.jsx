export const SelectBudgetOptions = [
    { id: 1, title: 'Cheap', desc: "Stay conscious of costs", icon: '💵' },
    { id: 2, title: 'Moderate', desc: "Keep cost on the average side", icon: '💰' },
    { id: 3, title: 'Luxury', desc: "Dont worry about cost", icon: '💸' },
];

export const SelectTravelList = [
    { id: 1, title: 'Just Me', desc: "A sole traveler in exploration", icon: '✈️', people: '1' },
    { id: 2, title: 'A Couple', desc: "Two travelers in tandem", icon: '🥂', people: '2' },
    { id: 3, title: 'Family', desc: "A group of fun loving adv", icon: '🏡', people: '3 to 5 people' },
    { id: 4, title: 'Friends', desc: "A bunch of thrill-seekers", icon: '⛵', people: '5 to 12 people' },
];

export const AI_PROMPT = 'Generate a travel plan for {location} for {totalDays} days for {traveler} with a {budget} budget. Return the response in JSON format with the following keys: "tripSummary", "hotels" (array of {name, address, price, imageUrl, rating, description}), and "itinerary" (array of {day, plan: array of {time, placeName, placeDetails, imageUrl, ticketPricing, rating, timeToTravel}}).';