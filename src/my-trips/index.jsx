import { db } from '@/service/firebaseConfig';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import UserTripCard from './components/UserTripCard';

function MyTrips() {
    const navigate = useNavigate();
    const [userTrips,setUserTrips] = useState([]);
    useEffect(() =>{
        GetUserTrips();
    },[])
    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/');
            return;
        }
        setUserTrips([]);

        let tripsList = [];

        // Fetch any locally saved offline trips
        try {
            const localTrips = JSON.parse(localStorage.getItem('local_trips') || '[]');
            const userLocalTrips = localTrips.filter(t => t.userEmail === user.email);
            tripsList = [...userLocalTrips];
        } catch (e) {
            console.error("Error reading local trips:", e);
        }

        try {
            const q = query(collection(db, 'AiTrips'), where('userEmail', '==', user?.email));
            const querySnapshot = await getDocs(q);
            const fbTrips = [];
            querySnapshot.forEach((doc) => {
                fbTrips.push(doc.data());
            });

            // Merge local and Firebase trips, filtering duplicates
            const allTrips = [...tripsList, ...fbTrips];
            const uniqueTrips = allTrips.filter((value, index, self) =>
                self.findIndex(t => t.id === value.id) === index
            );

            setUserTrips(uniqueTrips);
        } catch (error) {
            console.warn("Firebase query failed, rendering locally stored trips:", error);
            setUserTrips(tripsList);
        }
    };
   
  return (
    <div className='px-5 mt-12 sm:px-10 md:px-32 lg:px-56 xl:px-72"'>
      <h2 className='font-bold text-3xl mb-10'>My Trips</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 my-3'>
        {userTrips?.length>0 ? userTrips.map((trip,index)=>(
            <UserTripCard trip={trip} key={index} />
        ))
        : [1,2,3,4,5,6].map((item,index)=>(
            <div key={index} className='h-[200px] w-full bg-slate-200 animate-pulse rounded-xl'>
            </div>
        ))
        }
      </div>
    </div>
  )
}

export default MyTrips
