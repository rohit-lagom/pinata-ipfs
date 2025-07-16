'use client';

import { useState } from 'react';

export default function UploadFileToPinata() {
  const [message, setMessage] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [metadataHash, setMetadataHash] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setMessage('❌ No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setMessage('⏳ Uploading file...');
      const res = await fetch('/api/pinata/upload-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.IpfsHash) {
        setIpfsHash(data.IpfsHash);
        setMessage(`✅ File uploaded: ${data.IpfsHash}`);

        await pinMetadata(data.IpfsHash);
      } else {
        setMessage(`❌ File upload failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ Upload error');
    }
  };

  const pinMetadata = async (imageHash: string) => {
    const metadata = {
      name: 'Pixel Snakes',
      image: `ipfs://${imageHash}`,
      description: 'Generated via Next.js + Pinata',
    };

    try {
      setMessage('⏳ Pinning metadata...');
      const res = await fetch('/api/pinata/pin-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata),
      });

      const data = await res.json();
      if (res.ok && data.IpfsHash) {
        setMetadataHash(data.IpfsHash);
        setMessage(`✅ Metadata pinned: ${data.IpfsHash}`);
      } else {
        setMessage(`❌ Metadata pin failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Metadata error:', err);
      setMessage('❌ Metadata pin error');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload File to Pinata</h2>
      <input type="file" onChange={handleUpload} className="mb-4" />
      {message && <p className="text-sm mt-2">{message}</p>}
      {ipfsHash && (
        <p className="text-sm text-green-600">
          🖼 Image IPFS: <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} target="_blank" rel="noreferrer" className="underline">{ipfsHash}</a>
        </p>
      )}
      {metadataHash && (
        <p className="text-sm text-blue-600">
          📄 Metadata IPFS: <a href={`https://gateway.pinata.cloud/ipfs/${metadataHash}`} target="_blank" rel="noreferrer" className="underline">{metadataHash}</a>
        </p>
      )}
    </div>
  );
}
