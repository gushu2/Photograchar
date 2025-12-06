import React, { useRef, useState, useEffect } from 'react';
import { Icons } from '../constants';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onBack: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Unable to access camera. Please allow permissions.");
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw the video frame to canvas
        ctx.drawImage(videoRef.current, 0, 0);
        // Convert to base64 with MAXIMUM quality (1.0)
        const imageSrc = canvas.toDataURL('image/jpeg', 1.0);
        
        // Stop stream before proceeding
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        onCapture(imageSrc);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 space-y-6 animate-fade-in">
      <div className="w-full flex justify-between items-center mb-4">
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <Icons.ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-xl font-semibold">Take a Selfie</h2>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>

      <div className="relative w-full aspect-[3/4] md:aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4 text-center">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
          />
        )}
        
        {/* Face guide overlay */}
        {!error && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            <div className="w-48 h-64 border-2 border-dashed border-white rounded-[50%]"></div>
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-400 text-sm">
          Center your face in the frame and ensure good lighting.
        </p>
        <p className="text-gray-500 text-xs">
          Your photo is only used for matching and is processed privately.
        </p>
      </div>

      <button
        onClick={handleCapture}
        disabled={!!error}
        className="p-4 rounded-full bg-white text-black shadow-lg shadow-white/20 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="w-12 h-12 rounded-full border-4 border-black flex items-center justify-center">
            <div className="w-10 h-10 bg-black rounded-full"></div>
        </div>
      </button>
    </div>
  );
};

export default CameraCapture;