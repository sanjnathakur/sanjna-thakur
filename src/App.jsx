import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/custom/Header';
import Hero from './components/custom/Hero';
import CreateTrip from './create-trip';
import MyTrips from './my-trips';
import ViewTrip from './view-trip/[tripId]';
import Login from './Login';
import Register from './Register';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Dynamic Navigation Header */}
      <Header />
      
      {/* Route-driven Page Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/view-trip/:tripId" element={<ViewTrip />} />
        </Routes>
      </main>
      
      {/* Elegant toast notification container */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;