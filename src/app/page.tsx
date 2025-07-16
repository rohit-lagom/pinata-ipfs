// app/pinata-upload/page.tsx
'use client';

import UploadFileToPinata from '@/components/UploadFileToPinata';

export default function PinataUploadPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Upload File to Pinata (IPFS)</h1>
      <UploadFileToPinata />
    </main>
  );
}
