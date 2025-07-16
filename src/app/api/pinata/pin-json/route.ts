// app/api/pinata/pin-json/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const metadata = await req.json();

    const response = await axios.post(
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
  } catch (error: any) {
    console.error('Pinata JSON Upload Error:', error?.message, error?.response?.data);
    return NextResponse.json(
      { error: error?.response?.data?.error || 'Metadata pin failed' },
      { status: 500 }
    );
  }
}
