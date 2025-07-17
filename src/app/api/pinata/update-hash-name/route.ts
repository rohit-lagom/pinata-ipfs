import { NextResponse } from 'next/server';
import { updateHashMetadata } from '@/lib/pinata';

interface UpdateMetadataRequest {
  ipfsPinHash: string;
  name: string;
}

export async function PUT(req: Request) {
  try {
    const body: UpdateMetadataRequest = await req.json();
    const { ipfsPinHash, name } = body;

    if (!ipfsPinHash || !name) {
      return NextResponse.json({ error: 'Missing hash or name' }, { status: 400 });
    }

    await updateHashMetadata(ipfsPinHash, name);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error updating Pinata metadata:', message);
    return NextResponse.json({ error: 'Failed to update hash metadata' }, { status: 500 });
  }
}
