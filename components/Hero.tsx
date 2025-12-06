import React, { useState } from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';

interface HeroProps {
  onSelectRole: (role: UserRole) => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectRole }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePhotographerClick = () => {
    setShowLoginModal(true);
    setPassword('');
    setError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0820') {
      setShowLoginModal(false);
      onSelectRole(UserRole.PHOTOGRAPHER);
    } else {
      setError('Incorrect passcode');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-8 animate-fade-in relative">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-full shadow-2xl shadow-indigo-500/20 mb-4">
        <Icons.Aperture className="w-16 h-16 text-white" />
      </div>
      
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
          Find Your Moments
        </h1>
        <p className="text-lg md:text-xl text-gray-400">
          Use advanced AI to instantly find photos of yourself from events, weddings, and parties.
          No more scrolling through thousands of images.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md pt-8">
        <button
          onClick={() => onSelectRole(UserRole.USER)}
          className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <Icons.Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Find My Photos</span>
        </button>

        <button
          onClick={handlePhotographerClick}
          className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <Icons.Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>I'm a Photographer</span>
        </button>
      </div>

      <div className="pt-12 flex gap-8 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <Icons.Check className="w-4 h-4 text-green-500" />
          <span>Privacy Focused</span>
        </div>
        <div className="flex items-center gap-2">
          <Icons.Check className="w-4 h-4 text-green-500" />
          <span>Instant Matching</span>
        </div>
        <div className="flex items-center gap-2">
          <Icons.Check className="w-4 h-4 text-green-500" />
          <span>AI Powered</span>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Photographer Access</h2>
              <p className="text-sm text-gray-400">Please enter the access code to manage the gallery.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter passcode"
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    {error}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;