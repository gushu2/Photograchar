import React, { useState } from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';
import * as storage from '../services/storageService';

// Placeholder for the Background Image
// You can replace this URL with the specific image you uploaded
const DEITY_BG = "https://images.unsplash.com/photo-1605218427360-36390a85a49f?q=80&w=2070&auto=format&fit=crop";

interface HeroProps {
  onSelectRole: (role: UserRole) => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectRole }) => {
  // Photographer Login State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // User Details State
  const [showUserModal, setShowUserModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userError, setUserError] = useState('');

  // --- Photographer Logic ---
  const handlePhotographerClick = () => {
    setShowLoginModal(true);
    setPassword('');
    setLoginError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0820') {
      setShowLoginModal(false);
      onSelectRole(UserRole.PHOTOGRAPHER);
    } else {
      setLoginError('Incorrect passcode');
    }
  };

  // --- User (Guest) Logic ---
  const handleUserClick = () => {
    setShowUserModal(true);
    setUserName('');
    setUserEmail('');
    setUserError('');
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setUserError('Name is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setUserError('Please enter a valid email address');
      return;
    }

    try {
      await storage.saveSearcher(userName, userEmail);
      setShowUserModal(false);
      onSelectRole(UserRole.USER);
    } catch (err) {
      console.error(err);
      setUserError('Failed to save details. Please try again.');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] overflow-hidden">
      
      {/* --- Background Layer --- */}
      <div className="absolute inset-0 z-0">
        {/* The Image */}
        <img 
          src={DEITY_BG} 
          alt="Background" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-opacity duration-700 grayscale-[20%]" 
        />
        {/* Gradient Mix - The Requested Fancy Red/Black/Yellow/Orange Mix */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-red-950/80 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        
        {/* Fancy Conic Gradient Overlay */}
        <div className="absolute inset-0 opacity-40 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-red-900 via-transparent to-orange-900 mix-blend-color-dodge pointer-events-none"></div>
      </div>

      {/* --- Main Content Card (Glassmorphism) --- */}
      <div className="relative z-10 w-full max-w-3xl mx-4 animate-fade-in">
        <div className="backdrop-blur-xl bg-black/40 border border-red-500/20 rounded-[2rem] p-8 md:p-12 shadow-[0_0_50px_rgba(220,38,38,0.2)] flex flex-col items-center text-center space-y-8 relative overflow-hidden">
          
          {/* Subtle Glow behind Content */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-red-500/10 to-transparent rounded-[2rem] pointer-events-none"></div>

          {/* Logo with Fire Float Animation */}
          <div className="relative group">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative p-2 rounded-full transform transition-transform duration-500 hover:scale-110">
               <Icons.Lens className="w-28 h-28 drop-shadow-[0_4px_20px_rgba(234,88,12,0.6)]" />
            </div>
          </div>
          
          <div className="space-y-4 relative z-10">
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight drop-shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-orange-400 to-red-500 filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                PHOTOGRACHAR
              </span>
            </h1>
            <p className="text-lg md:text-xl text-orange-100/80 max-w-lg mx-auto leading-relaxed">
              Experience the magic of AI. Instantly find your moments from the event in seconds.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-md pt-4 relative z-10">
            <button
              onClick={handleUserClick}
              className="flex-1 group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-bold text-lg hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] hover:-translate-y-1 overflow-hidden border border-orange-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Icons.Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>Find My Photos</span>
            </button>

            <button
              onClick={handlePhotographerClick}
              className="flex-1 group relative flex items-center justify-center gap-3 px-8 py-4 bg-black/60 text-white rounded-2xl font-bold text-lg border border-red-500/30 hover:bg-black/80 hover:border-red-500/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm"
            >
              <Icons.Upload className="w-6 h-6 group-hover:-translate-y-1 transition-transform text-red-400" />
              <span>Photographer</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 flex flex-wrap justify-center gap-6 text-gray-400 text-sm font-medium relative z-10">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-red-500/20">
              <Icons.Check className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-red-500/20">
              <Icons.Check className="w-4 h-4 text-orange-400" />
              <span className="text-gray-300">AI Face Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modals (Styled) --- */}

      {/* Photographer Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0f0505] border border-red-900/50 w-full max-w-sm rounded-3xl shadow-[0_0_40px_rgba(220,38,38,0.15)] p-8 relative overflow-hidden">
             {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="mb-8">
              <div className="w-12 h-12 bg-red-950/50 border border-red-900 rounded-2xl flex items-center justify-center mb-4 text-orange-500">
                <Icons.Upload className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Photographer</h2>
              <p className="text-sm text-gray-400">Enter your secure passcode.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-red-900/50 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-lg tracking-widest"
                  placeholder="••••"
                  autoFocus
                />
                {loginError && (
                  <p className="text-red-400 text-sm mt-3 flex items-center gap-2 bg-red-950/50 border border-red-900/50 p-2 rounded-lg">
                    <Icons.Loader className="w-4 h-4" />
                    {loginError}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-700 to-orange-700 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 mt-2"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0f0505] border border-orange-900/50 w-full max-w-sm rounded-3xl shadow-[0_0_40px_rgba(234,88,12,0.15)] p-8 relative overflow-hidden">
             {/* Decorative glow */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <button 
              onClick={() => setShowUserModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="mb-8">
              <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center mb-4">
                <Icons.User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome</h2>
              <p className="text-sm text-gray-400">Tell us who you are to start searching.</p>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                    <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    placeholder="Enter your full name"
                    autoFocus
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                    <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    placeholder="Enter your email address"
                    />
                </div>
              </div>

              {userError && (
                <p className="text-red-400 text-sm flex items-center gap-2 bg-red-900/20 p-2 rounded-lg">
                  <Icons.Loader className="w-4 h-4" />
                  {userError}
                </p>
              )}
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-400 hover:to-yellow-400 font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(234,88,12,0.2)] mt-4"
              >
                Let's Go
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;