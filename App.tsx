import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import CameraCapture from './components/CameraCapture';
import PhotographerDashboard from './components/PhotographerDashboard';
import ScanningResults from './components/ScanningResults';
import { AppState, GalleryPhoto, UserRole } from './types';
import { Icons } from './constants';
import * as storage from './services/storageService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  // We only keep a subset in state for display to avoid crashing memory
  const [recentGallery, setRecentGallery] = useState<GalleryPhoto[]>([]);
  const [totalPhotos, setTotalPhotos] = useState<number>(0);
  const [userSelfie, setUserSelfie] = useState<string | null>(null);

  // Initialize DB and load initial stats
  useEffect(() => {
    const init = async () => {
      try {
        const count = await storage.getPhotoCount();
        setTotalPhotos(count);
        const recent = await storage.getRecentPhotos(24);
        setRecentGallery(recent);
      } catch (e) {
        console.error("Failed to initialize storage", e);
      }
    };
    init();
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
      
      // Save to IndexedDB
      await storage.savePhotos(newPhotos);
      
      // Update local state (stats and recent preview)
      const count = await storage.getPhotoCount();
      setTotalPhotos(count);
      const recent = await storage.getRecentPhotos(24);
      setRecentGallery(recent);
      
    } catch (error) {
      console.error("Error processing/saving files:", error);
      alert("Error saving photos. Ensure you have enough disk space.");
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
    <div className="min-h-screen bg-[#020101] text-zinc-100 flex flex-col font-sans selection:bg-orange-500/30">
      {/* Global Gradient Background */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-black to-black pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-red-900/10 bg-[#050202]/80 backdrop-blur supports-[backdrop-filter]:bg-[#050202]/60">
        <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between">
          <div 
            className="flex items-center gap-3 font-bold text-xl tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleBackToHome}
          >
            {/* New Lens Logo in Header */}
            <div className="w-8 h-8">
              <Icons.Lens className="w-full h-full" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400">
              PHOTOGRACHAR
            </span>
          </div>
          
          {role !== UserRole.NONE && (
            <div className="text-xs font-medium px-3 py-1 bg-red-950/30 text-red-200 rounded-full border border-red-900/30">
              {role === UserRole.PHOTOGRAPHER ? 'Photographer Mode' : 'Guest Mode'}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col">
        {appState === AppState.LANDING && (
          <Hero onSelectRole={handleRoleSelect} />
        )}

        {appState === AppState.PHOTOGRAPHER_DASHBOARD && (
          <PhotographerDashboard 
            recentGallery={recentGallery} 
            totalPhotos={totalPhotos}
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
            totalPhotos={totalPhotos}
            onBack={() => setAppState(AppState.USER_CAMERA)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-red-900/10 py-8 mt-auto bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2025 PHOTOGRACHAR. Powered by gushu_bhat.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;