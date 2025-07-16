'use client';

import { useEffect, useState } from 'react';

export default function ViewPinsPage() {
  const [pins, setPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await fetch('/api/pinata/pinList');
        const data = await res.json();
        if (res.ok) setPins(data.pins);
      } catch (err) {
        console.error('Fetch pins error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#f6f8f2] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-[#2f4f4f]">🌿 All Organic Certificates</h1>
      {loading ? (
        <p className="text-[#7d7d7d]">⏳ Loading pins...</p>
      ) : pins.length === 0 ? (
        <p className="text-[#a94442]">⚠️ No pinned files found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pins.map((pin, index) => (
            <div
              key={index}
              className="bg-white border border-[#e1e1e1] rounded-xl shadow-md hover:shadow-lg transition p-4 space-y-3"
            >
              <img
                src={pin.image}
                alt={pin.name}
                className="w-full h-40 object-cover rounded-md border"
              />
              <h3 className="text-lg font-semibold text-[#3a4d39] truncate">{pin.name}</h3>
              <p className="text-xs text-gray-600 break-all">
                <strong>Hash:</strong> {pin.ipfsHash}
              </p>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${pin.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-green-700 font-medium underline"
              >
                View on IPFS ↗
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
