import React, { useEffect, useState } from 'react';

function InteractiveMap({ locationName }) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (locationName) {
      fetchCoordinates();
    }
  }, [locationName]);

  const fetchCoordinates = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`
      );
      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("Coordinates not found");
      }

      const { lat, lon } = data[0];
      setCoords({ lat, lon });
    } catch (err) {
      console.error("Failed to geocode location for map:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-xl shadow-blue-900/5 h-[230px] flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 mt-4 text-sm font-semibold">Generating Interactive Map...</p>
      </div>
    );
  }

  if (error || !coords) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-blue-900/5 h-[230px] flex flex-col justify-center items-center text-center">
        <span className="text-3xl">🗺️</span>
        <p className="text-slate-500 mt-3 text-sm font-bold">Interactive Map Unavailable</p>
        <p className="text-slate-400 text-xs mt-1">Unable to load geographic coordinates for this location.</p>
      </div>
    );
  }

  // Centered Google Map Embed URL centered on geocoded lat/lon coordinates
  const mapUrl = `https://maps.google.com/maps?q=${coords.lat},${coords.lon}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-3 shadow-xl shadow-blue-900/5 flex flex-col justify-between h-[230px] hover:shadow-xl hover:border-slate-200 transition-all duration-300 animate-slide-up">
      <div className="w-full h-full relative overflow-hidden rounded-2xl border border-slate-100">
        
        {/* Map Label Tag overlay */}
        <div className="absolute top-3 left-3 z-10 shadow-lg bg-white/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-slate-100">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Explore Map</span>
        </div>

        {/* Embedded Iframe */}
        <iframe
          title="Google Map Embed"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'contrast(1.05) brightness(0.98)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 select-none pointer-events-auto"
        ></iframe>

      </div>
    </div>
  );
}

export default InteractiveMap;
