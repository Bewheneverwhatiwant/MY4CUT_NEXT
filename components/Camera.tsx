'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  poseImages: string[];
  onComplete: (photos: string[]) => void;
}

type Phase = 'ready' | 'countdown' | 'flash' | 'done';

export default function Camera({ poseImages, onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const photosRef = useRef<string[]>([]);
  const isCapturingRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('ready');
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  // Setup webcam
  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('카메라 접근 오류:', err);
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // "준비하세요" → countdown after 3 seconds
  useEffect(() => {
    if (phase !== 'ready') return;
    const timer = setTimeout(() => {
      setPhase('countdown');
      setCountdown(10);
    }, 3000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'countdown') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, currentPoseIndex]);

  // Capture photo when countdown hits 0
  useEffect(() => {
    if (countdown !== 0 || phase !== 'countdown') return;
    if (isCapturingRef.current) return;
    isCapturingRef.current = true;

    const video = videoRef.current;
    if (!video) {
      isCapturingRef.current = false;
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      isCapturingRef.current = false;
      return;
    }

    // Mirror for selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const newPhotos = [...photosRef.current, dataUrl];
    photosRef.current = newPhotos;
    setCapturedPhotos(newPhotos);

    // Flash effect
    setPhase('flash');

    setTimeout(() => {
      isCapturingRef.current = false;
      if (newPhotos.length >= 4) {
        setPhase('done');
        streamRef.current?.getTracks().forEach((t) => t.stop());
        onComplete(newPhotos);
      } else {
        setCurrentPoseIndex((prev) => prev + 1);
        setCountdown(10);
        setPhase('countdown');
      }
    }, 800);
  }, [countdown, phase, onComplete]);

  return (
    <div className="page camera-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="camera-header">
        <span className="photo-progress">
          {Math.min(capturedPhotos.length + 1, 4)} / 4
        </span>
      </div>

      <div className="camera-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
        />
        {phase !== 'done' && currentPoseIndex < 4 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="pose-overlay"
            src={poseImages[currentPoseIndex]}
            alt="포즈 가이드"
          />
        )}
        {phase === 'flash' && <div className="flash-overlay" />}
        {phase === 'ready' && (
          <div className="ready-overlay">
            <span>준비하세요!</span>
          </div>
        )}
      </div>

      {phase === 'countdown' && (
        <div className="countdown-display">
          <span className="countdown-number" key={countdown}>
            {countdown}
          </span>
        </div>
      )}

      <div className="thumbnail-strip">
        {capturedPhotos.map((photo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={photo} alt={`촬영 ${i + 1}`} className="thumbnail" />
        ))}
        {Array.from({ length: 4 - capturedPhotos.length }).map((_, i) => (
          <div key={`empty-${i}`} className="thumbnail-empty" />
        ))}
      </div>
    </div>
  );
}
