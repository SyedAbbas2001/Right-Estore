import { NextResponse } from 'next/server';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const formData = await request.formData();
    const files = formData.getAll('images');
    const folder = formData.get('folder') || 'rightestore/products';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      return uploadImage(base64, folder);
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map(r => r.url);

    return NextResponse.json({ urls, message: `${urls.length} image(s) uploaded` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { publicId } = await request.json();
    if (!publicId) return NextResponse.json({ error: 'publicId required' }, { status: 400 });

    await deleteImage(publicId);
    return NextResponse.json({ message: 'Image deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
