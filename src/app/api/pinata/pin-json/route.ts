import { NextResponse } from 'next/server';
import axios from 'axios';

interface PinataJSONResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

export async function POST(req: Request) {
  try {
    const metadata: Record<string, any> = await req.json();

    const response = await axios.post<PinataJSONResponse>(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_API_SECRET_KEY!,
        },
      }
    );

    return NextResponse.json({ IpfsHash: response.data.IpfsHash });
  } catch (error: unknown) {
    let errorMessage = 'Metadata pin failed';

    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      (error as any).response?.data?.error
    ) {
      errorMessage = (error as any).response.data.error;
    }

    console.error('Pinata JSON Upload Error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
