import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        place && GetPlaceImg();
    }, [place])

    const GetPlaceImg = async () => {
        const placeName = place?.placeName;
        if (!placeName) return;

        try {
            const data = {
                textQuery: placeName
            }
            const resp = await GetPlaceDetails(data);
            const places = resp.data?.places;
            if (places && places.length > 0 && places[0].photos && places[0].photos.length > 0) {
                const photos = places[0].photos;
                const photoObj = photos[3] || photos[2] || photos[1] || photos[0];
                const googlePhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoObj.name);
                setPhotoUrl(googlePhotoUrl);
                return;
            }
        } catch (error) {
            console.warn("Google Places API failed for place image, using Flickr tourist attraction fallback:", error);
        }

        // Extract first two words of the place name for a high-quality, 100%-match Flickr search
        const words = placeName.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3).slice(0, 2);
        const cleanTags = ['travel', ...words].map(w => encodeURIComponent(w)).join(',');
        const fallbackUrl = `https://loremflickr.com/400/300/${cleanTags}`;
        setPhotoUrl(fallbackUrl);
    }
    return (
        <div className="my-4">
            <Link to={'https://www.google.com/maps/search/?api=1&query=' + place?.placeName + "," + place?.geoCoordinates} target='_blank'>
                <div className='bg-white border border-slate-100 rounded-3xl p-3 flex flex-col sm:flex-row gap-4 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg cursor-pointer group relative'>
                    
                    {/* Fitted Image Container */}
                    <div className='w-full sm:w-[140px] h-[140px] overflow-hidden rounded-2xl shrink-0 relative'>
                        <img 
                            src={photoUrl ? photoUrl : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80'} 
                            onError={(e) => {
                                if (e.target.src.includes('loremflickr.com')) {
                                    e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80';
                                } else {
                                    const placeNameStr = place?.placeName
                                        ? place.placeName.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3).slice(0, 2).join(',')
                                        : 'sightseeing';
                                    e.target.src = `https://loremflickr.com/400/300/travel,${encodeURIComponent(placeNameStr)}`;
                                }
                            }}
                            className='w-full h-full object-cover group-hover:scale-105 transition-all duration-500 rounded-2xl' 
                        />
                        {/* Rating Overlay */}
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-black text-slate-800 tracking-wider shadow-sm">
                            ⭐ {place.rating}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className='flex-1 flex flex-col justify-between py-1'>
                        <div>
                            <div className='flex justify-between items-center gap-2'>
                                <span className='text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-wider'>
                                    🕒 {place.time}
                                </span>
                            </div>
                            <h3 className='font-bold text-slate-800 text-base mt-2 group-hover:text-blue-600 transition line-clamp-1'>{place.placeName}</h3>
                            <p className='text-xs text-slate-400 font-semibold mt-1 line-clamp-2 leading-relaxed'>{place.placeDetails}</p>
                        </div>
                        
                        <div className='flex flex-wrap gap-2 mt-3 sm:mt-0'>
                            <span className='inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black tracking-wider uppercase text-blue-600 bg-blue-50 rounded-full'>
                                🎟️ {place.ticketPricing}
                            </span>
                        </div>
                    </div>

                    {/* Floating Map Pin Icon Action Button */}
                    <div className='absolute bottom-3 right-3 bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white p-2.5 rounded-xl transition duration-300 shrink-0 sm:static sm:self-center sm:ml-auto'>
                        <FaLocationDot className="text-sm" />
                    </div>

                </div>
            </Link>
        </div>
    )
}

export default PlaceCardItem
