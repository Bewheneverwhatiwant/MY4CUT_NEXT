import { NextResponse } from 'next/server';
import os from 'os';

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
    const id = Math.random().toString(36).substring(2, 10);

    photoStore.set(id, dataUrl);

    // Auto-delete after 10 minutes
    setTimeout(() => photoStore.delete(id), 10 * 60 * 1000);

    // Detect port and network IP for QR URL
    const host = request.headers.get('host') || 'localhost:3000';
    const port = host.split(':')[1] || '3000';
    const ip = getNetworkIP();
    const url = `http://${ip}:${port}/api/photo/${id}`;

    return NextResponse.json({ id, url });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// Export the photoStore so the [id] route can access it
export { photoStore };
