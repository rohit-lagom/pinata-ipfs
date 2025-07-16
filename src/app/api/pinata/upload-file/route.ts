// app/api/pinata/upload-file/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name')?.toString() || 'uploaded_file';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const data = new FormData();
    data.append('file', buffer, {
      filename: file.name,
      contentType: file.type,
    });
    data.append('pinataMetadata', JSON.stringify({ name }));

    const pinataApiKey = process.env.PINATA_API_KEY!;
    const pinataSecret = process.env.PINATA_API_SECRET_KEY!;

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      headers: {
        ...data.getHeaders(),
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecret,
      },
      maxBodyLength: Infinity,
    });

    return NextResponse.json({ IpfsHash: res.data.IpfsHash });
  } catch (err: any) {
    console.error('Pinata Upload Error:', err?.response?.data || err?.message);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
