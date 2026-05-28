import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function HotelCardItem({item}) {
    const [photoUrl,setPhotoUrl] = useState();

    useEffect(()=>{
      item&&GetPlaceImg();
    },[item])
  
    const GetPlaceImg=async()=>{ 
      const hotelName = item?.hotelName;
      if (!hotelName) return;

      try {
        const data={
          textQuery: hotelName
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
        console.warn("Google Places API failed for hotel image, using Flickr hotel fallback:", error);
      }

      // Extract first two words of the hotel name for a high-quality, 100%-match Flickr search
      const cleanKeyword = hotelName.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3).slice(0, 2).join(',');
      const fallbackUrl = `https://loremflickr.com/400/300/hotel,${encodeURIComponent(cleanKeyword)}`;
      setPhotoUrl(fallbackUrl);
    }
  return (
    <div className="h-full">
      <Link to={'https://www.google.com/maps/search/?api=1&query='+item?.hotelName+ "," +item?.hotelAddress} target='_blank' className="block h-full">
        <div className='hover:scale-[1.03] transition-all duration-300 hover:shadow-lg border border-slate-100 rounded-3xl overflow-hidden bg-white p-3 flex flex-col gap-3 group h-full cursor-pointer'>
          <div className="w-full h-[180px] overflow-hidden rounded-2xl relative shrink-0">
            <img 
              src={photoUrl ? photoUrl : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'} 
              onError={(e) => {
                if (e.target.src.includes('loremflickr.com')) {
                  e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80';
                } else {
                  const hotelNameStr = item?.hotelName
                    ? item.hotelName.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3).slice(0, 2).join(',')
                    : 'resort';
                  e.target.src = `https://loremflickr.com/400/300/hotel,${encodeURIComponent(hotelNameStr)}`;
                }
              }}
              className='w-full h-full object-cover group-hover:scale-105 transition-all duration-500 rounded-2xl'
            />
            {/* Elegant absolute rating overlay */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black text-slate-800 tracking-wider shadow-sm flex items-center gap-1">
              ⭐ {item?.rating}
            </div>
          </div>
          <div className='px-1 pb-1 flex flex-col gap-1.5 justify-between flex-1'>
            <div>
              <h3 className='font-bold text-slate-800 text-base group-hover:text-blue-600 transition truncate' title={item?.hotelName}>{item?.hotelName}</h3>
              <p className='text-xs text-slate-400 font-semibold truncate flex items-center gap-1 mt-1'>
                <span>📍</span> {item?.hotelAddress}
              </p>
            </div>
            <span className='inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black tracking-wider uppercase text-emerald-600 bg-emerald-50 rounded-full w-fit mt-1.5'>
              💵 {item?.price}
            </span>
          </div>
        </div>
      </Link>    
    </div>
  )
}

export default HotelCardItem
