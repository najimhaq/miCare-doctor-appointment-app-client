import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // ImageBB-তে আপলোড (Server Side — API Key Secret থাকে)
    const imagebbFormData = new FormData();
    imagebbFormData.append('image', file);
    imagebbFormData.append('key', process.env.IMAGEBB_API_KEY); // ✅ Secret, not exposed

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imagebbFormData,
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        url: data.data.url,
        delete_url: data.data.delete_url,
      });
    }

    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
