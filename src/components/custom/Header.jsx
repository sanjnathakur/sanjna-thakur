import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Header() {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Keep user profile in sync with localStorage across routes and events
  const syncUser = () => {
    try {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
    }
  };

  useEffect(() => {
    syncUser();
  }, [location.pathname]); // Sync user whenever route changes

  useEffect(() => {
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });
  
  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      syncUser();
      navigate('/create-trip');
    }).catch(err => {
      console.error(err);
    });
  }

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <header className="p-4 px-6 md:px-12 shadow-sm border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
      {/* Brand Logo & Link */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
        <img src="/logo.svg" alt="WEAVE Logo" className="h-9 w-auto" />
      </Link>
      
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/create-trip">
              <Button variant="outline" className="rounded-full font-semibold border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                + Create Trip
              </Button> 
            </Link>
            <Link to="/my-trips">
              <Button variant="outline" className="rounded-full font-semibold border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                My Trips
              </Button> 
            </Link>
            
            <Popover>
              <PopoverTrigger asChild>
                <button className="focus:outline-none rounded-full ring-2 ring-offset-2 ring-blue-500/30 overflow-hidden cursor-pointer transition active:scale-95">
                  <img 
                    src={user?.picture} 
                    alt={user?.name || "User"} 
                    className="rounded-full w-[38px] h-[38px] object-cover bg-slate-100" 
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <button 
                  className="w-full text-left px-3 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-lg transition cursor-pointer" 
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="rounded-full font-semibold cursor-pointer">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 font-semibold shadow-md shadow-blue-500/10 cursor-pointer">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Social Google Login Fallback Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
          <DialogHeader className="flex flex-col items-center text-center">
            <img src="/logo.svg" alt="WEAVE Logo" className="h-10 mb-4" />
            <h2 className="font-extrabold text-xl text-slate-800">Sign In with Google</h2>
            <p className="text-sm text-slate-500 mt-1">Access the travel planning suite securely using Google Authentication</p>
            <Button 
              onClick={login} 
              className="w-full mt-6 py-3 flex gap-3 items-center justify-center bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <FcGoogle className="h-6 w-6" />
              <span>Continue with Google</span>
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default Header
