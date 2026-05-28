import React from 'react'

function TripPlace({ trip }) {
  return (
    <div>
      <h2 className='font-bold text-lg mt-5'>Places to Visit</h2>
      <div>
        {trip?.tripData?.itinerary && Object.entries(trip.tripData.itinerary).map(([day, details]) => (
          <div key={day} className='mt-5'>
            <h2 className='font-medium text-lg'>{day}</h2>
            <div className='grid md:grid-cols-2 gap-5'>
              {details.plan.map((place, index) => (
                <div key={index} className='border rounded-xl p-3 hover:scale-105 transition-all'>
                  <h2 className='font-bold text-sm text-orange-600'>{place.time}</h2>
                  <h2 className='font-bold text-lg'>{place.placeName}</h2>
                  <p className='text-sm text-gray-400'>{place.placeDetails}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TripPlace