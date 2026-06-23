// src/components/molecules/CameraModal/CameraModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    // Stop any existing stream before starting a new one
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setError(null);
    try {
      // Request access to the user's camera.
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }, // 'user' prefers the front-facing camera
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission was denied. Please allow camera access in your browser settings.');
        } else {
          setError('Could not access the camera. Make sure it is not being used by another application.');
        }
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      // This is crucial to turn off the camera light and release the resource.
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    // Cleanup function to ensure camera is off when component unmounts
    return () => stopCamera();
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match the video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame onto the canvas
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas drawing to a Blob, then to a File
      canvas.toBlob(blob => {
        if (blob) {
          const capturedFile = new File([blob], `webcam-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(capturedFile); // Send the file back to the parent form
          onClose(); // Close the modal
        }
      }, 'image/jpeg');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">
          <X size={24} />
        </button>
        <h3 className="text-lg font-medium mb-4">Live Camera Capture</h3>
        
        {error ? (
          <div className="text-red-500 bg-red-100 p-4 rounded-md">
            <p><strong>Error:</strong> {error}</p>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-md"
              style={{ transform: 'scaleX(-1)' }} // Mirror the front camera
            />
            {/* Hidden canvas for taking the snapshot */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleCapture}
            disabled={!stream || !!error}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Camera size={20} />
            Snap Photo
          </button>
          <button
            onClick={startCamera}
            disabled={!!error}
            title="Restart Camera"
            className="p-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-400 disabled:text-white"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};