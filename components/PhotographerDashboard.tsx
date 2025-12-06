import React, { useRef } from 'react';
import { GalleryPhoto } from '../types';
import { Icons } from '../constants';

interface PhotographerDashboardProps {
  recentGallery: GalleryPhoto[];
  totalPhotos: number;
  onUpload: (files: FileList) => void;
  onBack: () => void;
}

const PhotographerDashboard: React.FC<PhotographerDashboardProps> = ({ recentGallery, totalPhotos, onUpload, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      // Reset input value to allow selecting the same files again
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold">Photographer Dashboard</h2>
            <p className="text-gray-400 text-sm">
              Total Uploads: <span className="text-white font-mono">{totalPhotos.toLocaleString()}</span>
            </p>
          </div>
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Icons.Upload className="w-4 h-4" />
          <span>Upload Photos</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {totalPhotos === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/30">
          <div className="p-4 bg-gray-800 rounded-full mb-4">
            <Icons.Upload className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-300">No photos yet</p>
          <p className="text-gray-500 text-sm mt-1">Upload photos to start building your gallery</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 text-indigo-400 hover:text-indigo-300 font-medium text-sm"
          >
            Select photos from device
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-semibold text-gray-200">Recently Added</h3>
            <span className="text-xs text-gray-500">Showing last {recentGallery.length} uploads</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentGallery.map((photo) => (
              <div key={photo.id} className="relative aspect-square group overflow-hidden rounded-xl bg-gray-900 border border-gray-800">
                <img
                  src={photo.url}
                  alt="Gallery item"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-xs font-mono text-white/80">{new Date(photo.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>

          {totalPhotos > recentGallery.length && (
            <div className="text-center py-8 text-gray-500 text-sm">
              <p>... and {totalPhotos - recentGallery.length} more photos in the secure vault.</p>
              <p className="text-xs mt-1 opacity-70">Large galleries are stored efficiently on your device.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotographerDashboard;
