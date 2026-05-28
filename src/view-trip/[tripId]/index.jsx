import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/TripPlace';
import WeatherWidget from '../components/WeatherWidget';
import InteractiveMap from '../components/InteractiveMap';

import { toast } from 'sonner';

function ViewTrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        tripId && GetTripData();
    }, [tripId]);

    const GetTripData = async () => {
        let foundTrip = null;

        // Try fetching from Firestore first
        try {
            const docRef = doc(db, "AiTrips", tripId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                foundTrip = docSnap.data();
            }
        } catch (error) {
            console.warn("Firebase getDoc failed, looking up local fallback:", error);
        }

        // If not found in Firestore or if Firestore failed, check local storage
        if (!foundTrip) {
            try {
                const localTrips = JSON.parse(localStorage.getItem('local_trips') || '[]');
                foundTrip = localTrips.find(t => t.id === tripId) || null;
            } catch (e) {
                console.error("Error reading local trips fallback:", e);
            }
        }

        if (foundTrip) {
            setTrip(foundTrip);
        } else {
            console.log("No such document!");
            toast.error("Trip not found in cloud or local database.");
        }
    };

    if (!trip) return <div className="p-10 text-center">Loading Trip...</div>;

    return (
        <div className="p-10 md:px-20 lg:px-44 xl:px-56">
            {/* Information Section */}
            <InfoSection trip={trip} />

            {/* Weather & Interactive Map Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 print:hidden">
                <WeatherWidget locationName={trip?.userSelection?.location} />
                <InteractiveMap locationName={trip?.userSelection?.location} />
            </div>

            {/* Recommended Hotels */}
            <Hotels trip={trip} />

            {/* Daily Plan */}
            <PlacesToVisit trip={trip} />
        </div>
    );
}
export default ViewTrip;