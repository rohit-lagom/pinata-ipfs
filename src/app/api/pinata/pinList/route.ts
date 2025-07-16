// app/api/pinata/pinList/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const res = await axios.get('https://api.pinata.cloud/data/pinList', {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT!}`,
      },
      params: {
        status: 'pinned',
        pageLimit: 100,
      },
    });

    const pins = res.data.rows.map((item: any) => ({
      name: item.metadata?.name || 'Unnamed',
      ipfsHash: item.ipfs_pin_hash,
      image: item.metadata?.keyvalues?.image || `https://gateway.pinata.cloud/ipfs/${item.ipfs_pin_hash}`,
      datePinned: item.date_pinned,
    }));

    return NextResponse.json({ pins });
  } catch (error: any) {
    console.error('PinList Fetch Error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to fetch pin list' }, { status: 500 });
  }
}
