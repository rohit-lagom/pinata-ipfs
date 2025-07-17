import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const name = formData.get('name')?.toString() || 'uploaded_file';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided or invalid type' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = new FormData();
    data.append('file', buffer, {
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
    });
    data.append('pinataMetadata', JSON.stringify({ name }));

    const pinataApiKey = process.env.PINATA_API_KEY!;
    const pinataSecret = process.env.PINATA_API_SECRET_KEY!;

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      headers: {
        ...data.getHeaders(),
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecret,
      },
      maxBodyLength: Infinity,
    });

    return NextResponse.json({ IpfsHash: response.data.IpfsHash });
  } catch (error: unknown) {
    let errorMessage = 'Upload failed';

    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      (error as any).response?.data
    ) {
      errorMessage = (error as any).response.data.error || 'Upload failed';
      console.error('Pinata Upload Error:', (error as any).response.data);
    } else if (error instanceof Error) {
      console.error('Pinata Upload Error:', error.message);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
