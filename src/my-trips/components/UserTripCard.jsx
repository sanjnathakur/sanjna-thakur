import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCard({trip}) {
  const [photoUrl,setPhotoUrl] = useState();

  useEffect(()=>{
    trip&&GetPlaceImg();
  },[trip])

  const GetPlaceImg=async()=>{
    const location = trip?.userSelection?.location;
    if (!location) return;

    try {
      const data={
        textQuery: location
      }
      const resp = await GetPlaceDetails(data);
      const places = resp.data?.places;
      if (places && places.length > 0 && places[0].photos && places[0].photos.length > 0) {
        const photos = places[0].photos;
        const photoObj = photos[3] || photos[2] || photos[1] || photos[0];
        const PhotoUrl=PHOTO_REF_URL.replace('{NAME}', photoObj.name);
        setPhotoUrl(PhotoUrl);
        return;
      }
    } catch (error) {
      console.warn("Google Places API failed, using Flickr travel fallback:", error);
    }

    // Extract first word of the location for a high-quality, 100%-match Flickr search
    const cleanKeyword = location.split(',')[0].trim().split(/\s+/)[0];
    const fallbackUrl = `https://loremflickr.com/800/600/${encodeURIComponent(cleanKeyword)}`;
    setPhotoUrl(fallbackUrl);
  }
  return (
   <Link to={'/view-trip/'+trip?.id} className="h-full block">
    <div className='hover:scale-[1.03] transition-all duration-300 hover:shadow-lg border border-slate-100 rounded-3xl overflow-hidden bg-white p-3 flex flex-col gap-3 group h-full'>
      <div className="w-full h-[180px] overflow-hidden rounded-2xl relative shrink-0">
        <img 
          src={photoUrl ? photoUrl : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'} 
          onError={(e) => {
            if (e.target.src.includes('loremflickr.com')) {
              e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
            } else {
              const locationName = trip?.userSelection?.location
                ? trip.userSelection.location.split(',')[0].trim().split(/\s+/)[0]
                : 'travel';
              e.target.src = `https://loremflickr.com/800/600/${encodeURIComponent(locationName)}`;
            }
          }}
          className='w-full h-full object-cover group-hover:scale-105 transition-all duration-500 rounded-2xl'
        />
        {/* Modern glassmorphic budget indicator */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-800 tracking-wider shadow-sm uppercase">
          💵 {trip?.userSelection?.budget}
        </div>
      </div>
      
      <div className="px-1 pb-1 flex flex-col justify-between flex-1">
        <div>
          <h2 className='font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition truncate capitalize' title={trip?.userSelection?.location}>
            {trip?.userSelection?.location}
          </h2>
          <h2 className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5" >
            <span>🗓️</span> {trip?.userSelection?.totalDays} Days Trip • {trip?.userSelection?.traveler} Travelers
          </h2>
        </div>
      </div>
    </div>
   </Link>
  )
}

export default UserTripCard;
