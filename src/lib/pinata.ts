import PinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_API_SECRET_KEY!,
});

/**
 * Pins a file (from Buffer) to IPFS using Pinata.
 * @param buffer - The file content as a buffer.
 * @param name - Metadata name to associate with the file.
 */
export function pinFileToIPFS(buffer: Buffer, name: string) {
  const stream = Readable.from(buffer);
  return pinata.pinFileToIPFS(stream, {
    pinataMetadata: { name },
  });
}

/**
 * Pins a JSON object to IPFS using Pinata.
 * @param content - The JSON data.
 * @param name - Metadata name to associate with the JSON.
 */
export function pinJSONToIPFS(content: Record<string, unknown>, name: string) {
  return pinata.pinJSONToIPFS(content, {
    pinataMetadata: { name },
  });
}

/**
 * Updates metadata (like name or keyvalues) for an existing IPFS pin.
 * @param ipfsPinHash - The IPFS hash of the pinned file.
 * @param name - The new name to assign to the pin.
 */
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
      keyvalues: {}, // You can optionally populate this
    }),
  });

  if (!res.ok) {
    let errorMessage = 'Unknown error';
    try {
      const errorData: { error?: string } = await res.json();
      errorMessage = errorData?.error || errorMessage;
    } catch {
      // silently ignore JSON parsing error
    }
    throw new Error(`Failed to update metadata: ${errorMessage}`);
  }
}
