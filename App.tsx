import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import CameraCapture from './components/CameraCapture';
import PhotographerDashboard from './components/PhotographerDashboard';
import ScanningResults from './components/ScanningResults';
import { AppState, GalleryPhoto, UserRole } from './types';
import { Icons } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [userSelfie, setUserSelfie] = useState<string | null>(null);

  // Pre-load some dummy images into gallery if empty for demo purposes
  useEffect(() => {
    // In a real app, this would fetch from a backend. 
    // Here we initialize empty or could load from localStorage.
    const saved = localStorage.getItem('photograchar_gallery');
    if (saved) {
      try {
        setGallery(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse gallery from localStorage", e);
      }
    }
  }, []);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === UserRole.PHOTOGRAPHER) {
      setAppState(AppState.PHOTOGRAPHER_DASHBOARD);
    } else {
      setAppState(AppState.USER_CAMERA);
    }
  };

  const handlePhotographerUpload = async (files: FileList) => {
    // Process all files in parallel
    const filePromises = Array.from(files).map(file => {
      return new Promise<GalleryPhoto>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Fallback for randomUUID in case context is not secure
          const id = (typeof crypto !== 'undefined' && crypto.randomUUID) 
            ? crypto.randomUUID() 
            : Math.random().toString(36).substring(2) + Date.now().toString(36);
            
          resolve({
            id,
            url: reader.result as string,
            timestamp: Date.now(),
            photographerId: 'demo-photographer'
          });
        };
        reader.readAsDataURL(file);
      });
    });

    try {
      const newPhotos = await Promise.all(filePromises);
      
      setGallery(prev => {
        const updated = [...newPhotos, ...prev];
        // Side effect: Save to local storage
        try {
          localStorage.setItem('photograchar_gallery', JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save to localStorage", e);
        }
        return updated;
      });
    } catch (error) {
      console.error("Error reading files:", error);
    }
  };

  const handleUserCapture = (imageSrc: string) => {
    setUserSelfie(imageSrc);
    setAppState(AppState.USER_RESULTS);
  };

  const handleBackToHome = () => {
    setAppState(AppState.LANDING);
    setRole(UserRole.NONE);
    setUserSelfie(null);
  };

  // --- Render Logic ---

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/80 backdrop-blur supports-[backdrop-filter]:bg-[#09090b]/60">
        <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between">
          <div 
            className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleBackToHome}
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Icons.Aperture className="w-5 h-5 text-white" />
            </div>
            <span>PHOTOGRACHAR</span>
          </div>
          
          {role !== UserRole.NONE && (
            <div className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full border border-white/10">
              {role === UserRole.PHOTOGRAPHER ? 'Photographer Mode' : 'Guest Mode'}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {appState === AppState.LANDING && (
          <Hero onSelectRole={handleRoleSelect} />
        )}

        {appState === AppState.PHOTOGRAPHER_DASHBOARD && (
          <PhotographerDashboard 
            gallery={gallery} 
            onUpload={handlePhotographerUpload} 
            onBack={handleBackToHome}
          />
        )}

        {appState === AppState.USER_CAMERA && (
          <div className="flex-1 flex flex-col justify-center">
             <CameraCapture 
              onCapture={handleUserCapture} 
              onBack={handleBackToHome}
            />
          </div>
        )}

        {appState === AppState.USER_RESULTS && userSelfie && (
          <ScanningResults 
            userSelfie={userSelfie} 
            gallery={gallery}
            onBack={() => setAppState(AppState.USER_CAMERA)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 PHOTOGRACHAR. Powered by Gemini AI.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;