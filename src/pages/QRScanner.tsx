import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, Camera, RefreshCw } from 'lucide-react';
import jsQR from 'jsqr';
import api from '../api';

type ScanResult = {
  valid: boolean;
  message: string;
  booking?: any;
};

export default function QRScanner() {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const streamRef  = useRef<MediaStream | null>(null);
  const rafRef     = useRef<number>(0);

  const [scanning, setScanning]   = useState(false);
  const [result, setResult]       = useState<ScanResult | null>(null);
  const [error, setCameraError]   = useState('');
  const [loading, setLoading]     = useState(false);

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setScanning(false);
  };

  const startCamera = async () => {
    setResult(null);
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);
    } catch {
      setCameraError('Camera access denied. Please allow camera permission.');
    }
  };

  const verifyQR = async (qrData: string) => {
    stopCamera();
    setLoading(true);
    try {
      const res = await api.get(`/admin/verify-qr/${qrData}`);
      setResult(res.data);
    } catch (err: any) {
      setResult(err.response?.data || { valid: false, message: 'Verification failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scanning) return;

    const tick = () => {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code?.data) {
        verifyQR(code.data);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scanning]);

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="content-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
            <Camera size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="section-heading mb-0">QR Ticket Scanner</h2>
            <p className="text-xs text-muted">Scan passenger boarding pass to verify</p>
          </div>
        </div>

        {/* Camera view */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-black mb-6" style={{ aspectRatio: '4/3' }}>
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning overlay */}
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-56 h-56 border-4 border-white rounded-2xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary/70 animate-pulse" />
              </div>
              <p className="absolute bottom-4 text-white text-sm font-medium bg-black/50 px-4 py-1 rounded-full">
                Point camera at QR code
              </p>
            </div>
          )}

          {!scanning && !loading && !result && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <p className="text-white text-sm">Camera off</p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <p className="text-white text-sm font-medium animate-pulse">Verifying ticket...</p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          {!scanning ? (
            <button onClick={startCamera} className="btn-primary flex-1 justify-center py-3">
              <Camera size={18} /> Start Scanning
            </button>
          ) : (
            <button onClick={stopCamera} className="btn-primary flex-1 justify-center py-3 bg-gray-500 hover:bg-gray-600">
              Stop Camera
            </button>
          )}
          {result && (
            <button onClick={() => { setResult(null); startCamera(); }} className="btn-primary justify-center px-4">
              <RefreshCw size={18} /> Scan Again
            </button>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className={`rounded-2xl p-6 border-2 ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              {result.valid
                ? <CheckCircle size={32} className="text-primary flex-shrink-0" />
                : <XCircle size={32} className="text-red-500 flex-shrink-0" />
              }
              <div>
                <p className={`text-lg font-bold ${result.valid ? 'text-primary' : 'text-red-600'}`}>
                  {result.valid ? '✅ Valid Ticket' : '❌ Invalid Ticket'}
                </p>
                <p className="text-sm text-muted">{result.message}</p>
              </div>
            </div>

            {result.booking && (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                {[
                  { label: 'Passenger',   value: result.booking.passenger_name },
                  { label: 'Email',       value: result.booking.email },
                  { label: 'Route',       value: `${result.booking.from_city} → ${result.booking.to_city}` },
                  { label: 'Bus',         value: `${result.booking.bus_name} (${result.booking.plate})` },
                  { label: 'Departure',   value: new Date(result.booking.departure_time).toLocaleString() },
                  { label: 'Seat',        value: result.booking.seat_number },
                  { label: 'Price',       value: `${parseFloat(result.booking.price).toLocaleString()} RWF` },
                  { label: 'Status',      value: result.booking.status },
                  { label: 'Payment',     value: result.booking.payment_status },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted font-medium">{item.label}</span>
                    <span className="font-semibold text-black">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
