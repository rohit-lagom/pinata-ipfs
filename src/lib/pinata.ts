import PinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_API_SECRET_KEY!,
});


export function pinFileToIPFS(buffer: Buffer, name: string) {
  const stream = Readable.from(buffer);
  return pinata.pinFileToIPFS(stream, {
    pinataMetadata: { name },
  });
}

export function pinJSONToIPFS(content: Record<string, unknown>, name: string) {
  return pinata.pinJSONToIPFS(content, {
    pinataMetadata: { name },
  });
}

export async function updateHashMetadata(ipfsPinHash: string, name: string): Promise<void> {
  const res = await fetch('https://api.pinata.cloud/pinning/hashMetadata', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ipfsPinHash,
      name,
      keyvalues: {}, 
    }),
  });

  if (!res.ok) {
    let errorMessage = 'Unknown error';
    try {
      const errorData: { error?: string } = await res.json();
      errorMessage = errorData?.error || errorMessage;
    } catch {
      
    }
    throw new Error(`Failed to update metadata: ${errorMessage}`);
  }
}
