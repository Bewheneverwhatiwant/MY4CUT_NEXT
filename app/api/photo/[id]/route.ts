import { NextResponse } from 'next/server';
import { photoStore } from '../route';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dataUrl = photoStore.get(id);

  if (!dataUrl) {
    return new NextResponse('사진을 찾을 수 없습니다', { status: 404 });
  }

  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="my4cut_${id}.jpg"`,
    },
  });
}
