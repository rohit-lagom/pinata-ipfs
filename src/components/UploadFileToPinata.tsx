// ✅ UploadFileToPinata.tsx (Client Component)
'use client';

import { useState } from 'react';

export default function UploadFileToPinata() {
  const [certName, setCertName] = useState('');
  const [message, setMessage] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [metadataHash, setMetadataHash] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !certName.trim()) {
      setMessage('❌ Please enter certificate name and select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', certName);

    try {
      setMessage('⏳ Uploading file...');
      const res = await fetch('/api/pinata/upload-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.IpfsHash) {
        setIpfsHash(data.IpfsHash);
        setMessage('✅ Image uploaded! Pinning metadata...');
        await pinMetadata(data.IpfsHash);
      } else {
        setMessage(`❌ Upload failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ Upload error');
    }
  };

  const pinMetadata = async (imageHash: string) => {
    const metadata = {
      name: certName,
      image: `ipfs://${imageHash}`,
      description: `Certificate for ${certName}`,
    };

    try {
      const res = await fetch('/api/pinata/pin-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata),
      });

      const data = await res.json();
      if (res.ok && data.IpfsHash) {
        setMetadataHash(data.IpfsHash);
        setMessage('✅ Metadata pinned to IPFS');
      } else {
        setMessage(`❌ Metadata pin failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Metadata error:', err);
      setMessage('❌ Metadata pin error');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Upload Certificate</h2>

      <input
        type="text"
        placeholder="Enter Certificate Name"
        value={certName}
        onChange={(e) => setCertName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="w-full"
      />

      {message && <p className="text-sm mt-2 text-gray-700">{message}</p>}

      {ipfsHash && (
        <p className="text-sm text-green-600">
          🖼 Image IPFS:{' '}
          <a
            href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {ipfsHash}
          </a>
        </p>
      )}

      {metadataHash && (
        <p className="text-sm text-blue-600">
          📄 Metadata IPFS:{' '}
          <a
            href={`https://gateway.pinata.cloud/ipfs/${metadataHash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {metadataHash}
          </a>
        </p>
      )}
    </div>
  );
}