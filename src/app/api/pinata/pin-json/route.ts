import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

interface PinataMetadata {
  pinataMetadata: {
    name: string;
    keyvalues?: Record<string, string>;
  };
  pinataContent: Record<string, unknown>;
}

interface PinataJSONResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

export async function POST(req: Request) {
  try {
    const metadata: PinataMetadata = await req.json();

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

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || error.message;
      console.error('Pinata JSON Upload Error:', error.response?.data);
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Pinata JSON Upload Error:', error.message);
    } else {
      console.error('Unknown error type:', error);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
