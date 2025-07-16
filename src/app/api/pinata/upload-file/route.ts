// app/api/pinata/upload-file/route.ts

import { NextResponse } from 'next/server';
import Pinata from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new Pinata({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_API_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid file input' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const readableStream = Readable.from(buffer);

    const response = await pinata.pinFileToIPFS(readableStream, {
      pinataMetadata: {
        name: file.name || 'uploaded_file',
      },
    });

    return NextResponse.json({ IpfsHash: response.IpfsHash });
  } catch (error: any) {
    console.error('Pinata Upload Error:', error.message || error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
