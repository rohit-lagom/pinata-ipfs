// app/api/pinata/pin-json/route.ts

import { NextResponse } from 'next/server';
import Pinata from '@pinata/sdk';

const pinata = new Pinata({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_API_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await pinata.pinJSONToIPFS(body, {
      pinataMetadata: { name: 'metadata.json' },
    });

    return NextResponse.json({ IpfsHash: response.IpfsHash });
  } catch (error: any) {
    console.error('Pinata JSON Upload Error:', error.message || error);
    return NextResponse.json({ error: 'Metadata pin failed' }, { status: 500 });
  }
}
