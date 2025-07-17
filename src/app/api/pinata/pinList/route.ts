import { NextResponse } from 'next/server';
import axios from 'axios';

interface PinataMetadata {
  name?: string;
  keyvalues?: {
    image?: string;
    [key: string]: string | undefined;
  };
}

interface PinataItem {
  ipfs_pin_hash: string;
  date_pinned: string;
  metadata?: PinataMetadata;
}

interface PinataResponse {
  count: number;
  rows: PinataItem[];
}

export async function GET() {
  try {
    const res = await axios.get<PinataResponse>('https://api.pinata.cloud/data/pinList', {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT!}`,
      },
      params: {
        status: 'pinned',
        pageLimit: 100,
      },
    });

    const pins = res.data.rows.map((item) => ({
      name: item.metadata?.name || 'Unnamed',
      ipfsHash: item.ipfs_pin_hash,
      image:
        item.metadata?.keyvalues?.image ||
        `https://gateway.pinata.cloud/ipfs/${item.ipfs_pin_hash}`,
      datePinned: item.date_pinned,
    }));

    return NextResponse.json({ pins });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('PinList Fetch Error:', message);
    return NextResponse.json({ error: 'Failed to fetch pin list' }, { status: 500 });
  }
}
