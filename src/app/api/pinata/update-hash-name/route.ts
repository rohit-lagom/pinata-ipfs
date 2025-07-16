import { NextResponse } from 'next/server';
import { updateHashMetadata } from '@/lib/pinata';

export async function PUT(req: Request) {
  try {
    const { ipfsPinHash, name } = await req.json();

    if (!ipfsPinHash || !name) {
      return NextResponse.json({ error: 'Missing hash or name' }, { status: 400 });
    }

    await updateHashMetadata(ipfsPinHash, name);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating Pinata metadata:', error.message);
    return NextResponse.json({ error: 'Failed to update hash metadata' }, { status: 500 });
  }
}
