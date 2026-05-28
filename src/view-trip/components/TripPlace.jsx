import React from 'react'
import PlaceCardItem from './PlaceCardItem';

function TripPlace({trip}) {
  return (
    <div className='my-6'>
      <h2 className='font-extrabold text-xl my-4 text-slate-800'>Places to Visit</h2>
      <div>
        {trip?.tripData?.itinerary?.map((item,i)=>(
            <div key={i} className="day-plan-break my-6">
                <h2 className='font-bold text-lg my-3 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block'>
                  Day {item?.day} - {item?.theme || 'Activities'}
                </h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    {item.plan?.map((place,index)=>(
                      <PlaceCardItem key={index} place={place}/>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}

export default TripPlace
