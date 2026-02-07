import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import os from 'os';

// In-memory store for local development only
const photoStore = new Map<string, string>();

function getNetworkIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

export async function POST(request: Request) {
  try {
    const dataUrl = await request.text();

    // Production: use Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');

      const blob = await put(`my4cut-${Date.now()}.jpg`, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
      });

      // Return the blob's public URL directly — no /api/photo/[id] needed
      return NextResponse.json({ id: '', url: blob.url });
    }

    // Development: in-memory store + network IP
    const id = Math.random().toString(36).substring(2, 10);
    photoStore.set(id, dataUrl);
    setTimeout(() => photoStore.delete(id), 10 * 60 * 1000);

    const host = request.headers.get('host') || 'localhost:3000';
    const port = host.split(':')[1] || '3000';
    const ip = getNetworkIP();
    const url = `http://${ip}:${port}/api/photo/${id}`;

    return NextResponse.json({ id, url });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export { photoStore };
