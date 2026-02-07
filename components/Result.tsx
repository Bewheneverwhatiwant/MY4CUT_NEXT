'use client';

import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  photos: string[];
  onReset: () => void;
}

export default function Result({ photos, onReset }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('');

  useEffect(() => {
    generateCombinedImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = src;
    });

  const generateCombinedImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const borderW = 6;
    const padding = 20;
    const photoW = 480;
    const photoH = 360;
    const logoH = 80;
    const logoMargin = 16;

    canvas.width = photoW * 2 + padding * 3;
    canvas.height = photoH * 2 + padding * 3 + logoMargin + logoH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each photo with #FFAD9D border
    try {
      for (let i = 0; i < 4; i++) {
        const img = await loadImage(photos[i]);
        const x = padding + (i % 2) * (photoW + padding);
        const y = padding + Math.floor(i / 2) * (photoH + padding);

        // Border
        ctx.fillStyle = '#FFAD9D';
        ctx.fillRect(
          x - borderW, y - borderW,
          photoW + borderW * 2, photoH + borderW * 2
        );

        // Photo
        ctx.drawImage(img, x, y, photoW, photoH);
      }
    } catch (err) {
      console.error('사진 합성 오류:', err);
      return;
    }

    // Logo at bottom
    try {
      const logo = await loadImage('/images/logo_main.svg');
      const logoRatio = logo.naturalWidth / logo.naturalHeight;
      const drawH = logoH;
      const drawW = drawH * logoRatio;
      const logoX = (canvas.width - drawW) / 2;
      const logoY = canvas.height - logoH;
      ctx.drawImage(logo, logoX, logoY, drawW, drawH);
    } catch {
      // fallback: skip logo
    }

    // Generate download data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setDownloadUrl(dataUrl);

    // Upload to server and get network-accessible URL for QR code
    try {
      const res = await fetch('/api/photo', { method: 'POST', body: dataUrl });
      const { url } = await res.json();
      setQrValue(url);
    } catch {
      console.warn('QR용 업로드 실패 — 다운로드 버튼을 이용하세요');
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `my4cut_${Date.now()}.jpg`;
    link.click();
  };

  return (
    <div className="page result-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <h1 className="title">촬영 완료!</h1>

      <div className="result-preview">
        <canvas ref={canvasRef} className="result-canvas" />
      </div>

      {qrValue && (
        <div className="qr-section">
          <QRCodeSVG value={qrValue} size={180} level="M" />
          <p className="qr-text">QR코드를 스캔하여 저장하세요</p>
        </div>
      )}

      <div className="result-actions">
        <button className="action-btn download-btn" onClick={handleDownload}>
          다운로드
        </button>
        <button className="action-btn reset-btn" onClick={onReset}>
          처음으로
        </button>
      </div>
    </div>
  );
}
