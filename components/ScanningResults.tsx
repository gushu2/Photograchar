import React, { useEffect, useState, useRef } from 'react';
import { GalleryPhoto } from '../types';
import { compareFaces } from '../services/geminiService';
import { Icons } from '../constants';
import { jsPDF } from 'jspdf';

interface ScanningResultsProps {
  userSelfie: string;
  gallery: GalleryPhoto[];
  onBack: () => void;
}

const ScanningResults: React.FC<ScanningResultsProps> = ({ userSelfie, gallery, onBack }) => {
  const [matches, setMatches] = useState<GalleryPhoto[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [scannedCount, setScannedCount] = useState(0);
  
  // State to track which photo has the download menu open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Ref to track if component is mounted to avoid state updates after unmount
  const isMounted = useRef(true);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.download-menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    const scanGallery = async () => {
      setIsScanning(true);
      setProgress(0);
      setMatches([]);
      setScannedCount(0);

      const total = gallery.length;

      if (total === 0) {
        if (isMounted.current) setIsScanning(false);
        return;
      }

      // Process in batches/sequence
      for (let i = 0; i < total; i++) {
        // Stop processing if user navigated away
        if (!isMounted.current) break;

        const photo = gallery[i];
        try {
          // Compare selfie with current photo
          const result = await compareFaces(userSelfie, photo.url);
          
          if (isMounted.current) {
            if (result.match) {
              // Update matches immediately for better UX
              setMatches(prev => [...prev, photo]);
            }
            setScannedCount(prev => prev + 1);
            setProgress(((i + 1) / total) * 100);
          }
        } catch (e) {
          console.error("Failed to scan photo", e);
        }
      }

      if (isMounted.current) {
        setIsScanning(false);
        setProgress(100);
      }
    };

    scanGallery();

    return () => {
      isMounted.current = false;
    };
  }, [userSelfie, gallery]);

  // --- Download Logic ---

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpenMenuId(null);
  };

  const handleDownloadOriginal = (photo: GalleryPhoto) => {
    // Detect mime type to give correct extension
    const mime = photo.url.match(/data:image\/(\w+);/)?.[1] || 'jpg';
    downloadFile(photo.url, `photo-${photo.id}.${mime}`);
  };

  const handleDownloadConverted = (photo: GalleryPhoto, format: 'png' | 'jpeg') => {
    const img = new Image();
    img.src = photo.url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // Use 1.0 quality (max)
        const newUrl = canvas.toDataURL(`image/${format}`, 1.0);
        const ext = format === 'jpeg' ? 'jpg' : 'png';
        downloadFile(newUrl, `photo-${photo.id}.${ext}`);
      }
    };
  };

  const handleDownloadPDF = (photo: GalleryPhoto) => {
    const img = new Image();
    img.src = photo.url;
    img.onload = () => {
      const doc = new jsPDF({
        orientation: img.naturalWidth > img.naturalHeight ? 'l' : 'p',
        unit: 'px',
        format: [img.naturalWidth, img.naturalHeight]
      });
      doc.addImage(photo.url, 'JPEG', 0, 0, img.naturalWidth, img.naturalHeight);
      doc.save(`photo-${photo.id}.pdf`);
      setOpenMenuId(null);
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8 animate-fade-in min-h-screen">
       <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Search Results</h2>
        </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar: Selfie & Stats */}
        <div className="w-full md:w-1/4 space-y-6">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 sticky top-4">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Your Reference</h3>
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-black mb-4">
                    <img src={userSelfie} alt="You" className="w-full h-full object-cover transform scale-x-[-1]" />
                </div>
                
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Scanning Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-indigo-500 h-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm border-t border-gray-800 pt-4">
                        <span className="text-gray-400">Scanned</span>
                        <span className="font-mono">{scannedCount} / {gallery.length}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Found</span>
                        <span className="text-green-400 font-mono font-bold">{matches.length}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Grid: Results */}
        <div className="w-full md:w-3/4">
            {isScanning && matches.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                    <Icons.Loader className="w-10 h-10 text-indigo-500 animate-spin" />
                    <p className="text-gray-400">Analyzing faces in the gallery...</p>
                </div>
            ) : matches.length === 0 && !isScanning ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
                     <div className="p-3 bg-gray-800 rounded-full">
                        <Icons.Search className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-300">No matches found</p>
                        <p className="text-sm text-gray-500">We couldn't find you in the current gallery.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map((photo) => (
                        <div key={photo.id} className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 animate-fade-in-up">
                            <div className="aspect-[4/3] overflow-hidden">
                                <img 
                                    src={photo.url} 
                                    alt="Matched result" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-4 flex justify-between items-center bg-gray-900">
                                <span className="text-xs text-gray-500 font-mono">
                                    ID: {photo.id.slice(0, 8)}
                                </span>
                                
                                <div className="relative download-menu-container">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(openMenuId === photo.id ? null : photo.id);
                                        }}
                                        className="text-xs bg-white text-black px-3 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                                    >
                                        Download 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </button>

                                    {openMenuId === photo.id && (
                                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-fade-in">
                                            <button 
                                                onClick={() => handleDownloadOriginal(photo)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <span className="font-semibold text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">ORIG</span>
                                                Original Quality
                                            </button>
                                            <button 
                                                onClick={() => handleDownloadConverted(photo, 'jpeg')}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                 <span className="font-semibold text-xs bg-blue-100 px-1.5 py-0.5 rounded text-blue-600">JPG</span>
                                                 Download JPG
                                            </button>
                                            <button 
                                                onClick={() => handleDownloadConverted(photo, 'png')}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <span className="font-semibold text-xs bg-green-100 px-1.5 py-0.5 rounded text-green-600">PNG</span>
                                                Download PNG
                                            </button>
                                            <button 
                                                onClick={() => handleDownloadPDF(photo)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-100"
                                            >
                                                 <span className="font-semibold text-xs bg-red-100 px-1.5 py-0.5 rounded text-red-600">PDF</span>
                                                 Download PDF
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                             <div className="absolute top-3 right-3 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                                <Icons.Check className="w-3 h-3" /> MATCH
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ScanningResults;