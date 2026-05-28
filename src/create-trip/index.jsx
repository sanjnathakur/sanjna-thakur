import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateTripWithFallback } from "@/service/AIModal";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from "@/constants/options";

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (!formData?.location || !formData?.totalDays || !formData?.budget || !formData?.traveler) {
      toast("Please fill all details!");
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location)
      .replace('{totalDays}', formData?.totalDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget);

    try {
      const textResult = await generateTripWithFallback(FINAL_PROMPT);
      SaveAiTrip(textResult);
    } catch (error) {
      console.log(error);
      toast("Error: " + (error.message || "Please try again later."));
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    const tripPayload = {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId
    };

    try {
      await setDoc(doc(db, "AiTrips", docId), tripPayload);
    } catch (error) {
      console.warn("Firebase Firestore write failed, saving locally:", error);
      
      const localTrips = JSON.parse(localStorage.getItem('local_trips') || '[]');
      localTrips.push(tripPayload);
      localStorage.setItem('local_trips', JSON.stringify(localTrips));
      
      toast.warning("Saved trip locally due to Firebase restrictions.");
    } finally {
      setLoading(false);
      navigate('/view-trip/' + docId);
    }
  };

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: { Authorization: `Bearer ${tokenInfo?.access_token}`, Accept: 'Application/json' }
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 sm:px-10 bg-white min-h-screen">
      <h2 className="font-extrabold text-3xl text-slate-800 tracking-tight">Tell us your travel preferences</h2>
      <p className="text-slate-500 mt-2 text-sm mb-12">Provide some basic details and let our AI curate the ideal itinerary for your trip.</p>
      
      <div className="flex flex-col gap-10">
        
        {/* Destination & Duration Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Enter Destination</label>
            <Input 
              placeholder="e.g. France, Delhi" 
              className="py-3 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 outline-none transition" 
              onChange={(e) => handleInputChange('location', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">How many days?</label>
            <Input 
              placeholder="e.g. 3, 15" 
              type="number" 
              className="py-3 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              onChange={(e) => handleInputChange('totalDays', e.target.value)} 
            />
          </div>
        </div>
        
        {/* Budget Options */}
        <div className="space-y-4">
          <h2 className="font-bold text-xl text-slate-800">What is Your Budget?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SelectBudgetOptions.map((item, index) => (
              <div 
                key={index} 
                onClick={() => handleInputChange('budget', item.title)} 
                className={`cursor-pointer p-5 border rounded-xl hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col items-start ${
                  formData.budget === item.title ? 'border-black ring-2 ring-black/5 shadow-sm' : 'border-slate-200 bg-white'
                }`}
              >
                <h2 className="text-3xl mb-3">{item.icon}</h2>
                <h2 className="font-bold text-slate-800 text-base">{item.title}</h2>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traveler Options */}
        <div className="space-y-4">
          <h2 className="font-bold text-xl text-slate-800">Who do you plan on traveling with on your next adventure?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SelectTravelList.map((item, index) => (
              <div 
                key={index} 
                onClick={() => handleInputChange('traveler', item.people)} 
                className={`cursor-pointer p-5 border rounded-xl hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col items-start ${
                  formData.traveler === item.people ? 'border-black ring-2 ring-black/5 shadow-sm' : 'border-slate-200 bg-white'
                }`}
              >
                <h2 className="text-3xl mb-3">{item.icon}</h2>
                <h2 className="font-bold text-slate-800 text-base">{item.title}</h2>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate("/")} 
            className="text-slate-500 hover:text-slate-700 font-bold text-sm transition cursor-pointer"
          >
            Cancel Trip
          </button>
          
          <Button 
            onClick={OnGenerateTrip} 
            disabled={loading}
            className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-xl font-bold transition shadow-md shadow-slate-900/10 cursor-pointer text-sm"
          >
            {loading ? <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" /> : 'Generate Trip'}
          </Button>
        </div>
      </div>

      {/* Auth Dialog fallback */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
          <Button onClick={login} className="w-full py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold flex gap-3 justify-center items-center cursor-pointer">
            <FcGoogle className="h-6 w-6" /> 
            <span>Sign In With Google</span>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CreateTrip;




