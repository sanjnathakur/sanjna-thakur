import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'



function InfoSection({trip}) {
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
    <div>
      <img 
        src={photoUrl ? photoUrl : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'} 
        onError={(e) => {
          if (e.target.src.includes('loremflickr.com')) {
            e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
          } else {
            const locationName = trip?.userSelection?.location
              ? trip.userSelection.location.split(',')[0].trim().split(/\s+/)[0]
              : 'travel';
            e.target.src = `https://loremflickr.com/800/600/${encodeURIComponent(locationName)}`;
          }
        }}
        className='h-[330px] w-full object-cover rounded-xl'
      />
       <div className='flex justify-between items-center flex-wrap gap-4'>
            <div className='my-6 flex flex-col gap-2'>
                <h2 className='font-bold text-2xl text-slate-800'>{trip?.userSelection?.location}</h2>
                <div className='flex flex-wrap gap-3 mt-2'>
                    <h2 className='bg-gray-100 font-semibold text-gray-600 rounded-full py-1 px-4 text-xs md:text-sm flex items-center gap-1.5'>
                      <span>🗓️</span> {trip?.userSelection?.totalDays} Day
                    </h2>
                    <h2 className='bg-gray-100 font-semibold text-gray-600 rounded-full py-1 px-4 text-xs md:text-sm flex items-center gap-1.5'>
                      <span>👩‍👧‍👦</span> {trip?.userSelection?.traveler} People
                    </h2>
                    <h2 className='bg-gray-100 font-semibold text-gray-600 rounded-full py-1 px-4 text-xs md:text-sm flex items-center gap-1.5'>
                      <span>💵</span> {trip?.userSelection?.budget} Budget
                    </h2>
                </div>
            </div>

            {/* Premium Export PDF Button */}
            <button 
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-full py-2.5 px-6 shadow-lg shadow-blue-500/20 cursor-pointer flex items-center gap-2 transition duration-300 hover:scale-[1.02] active:scale-95 print:hidden shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer">
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <path d="M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/>
                <rect x="6" y="14" width="12" height="8" rx="1"/>
              </svg>
              <span>Export PDF</span>
            </button>
       </div>
    </div>
  )
}

export default InfoSection
