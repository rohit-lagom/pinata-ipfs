"use client";

import { useState } from "react";
import { pinata } from "@/utils/config";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [name, setName] = useState("");
  const [farmer, setFarmer] = useState("");
  const [cid, setCid] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
  };

  const uploadFile = async () => {
    if (!file) return alert("No file selected");

    setUploading(true);
    try {
      const urlRes = await fetch("/api/url");
      const { url } = await urlRes.json();

      const upload = await pinata.upload.public.file(file).url(url);
      setCid(upload.cid);

      // Get access link for preview
      const accessRes = await fetch(`/api/preview?cid=${upload.cid}`);
      const { url: accessUrl } = await accessRes.json();

      setPreviewUrl(accessUrl);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <input
        type="text"
        placeholder="Product Name"
        className="border rounded px-3 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Farmer Name"
        className="border rounded px-3 py-2"
        value={farmer}
        onChange={(e) => setFarmer(e.target.value)}
      />
      <input
        type="file"
        onChange={handleChange}
        className="border rounded px-3 py-2"
      />
      <button
        type="button"
        disabled={uploading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        onClick={uploadFile}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {previewUrl && (
        <div className="mt-4 text-center">
          <h2 className="font-semibold">Preview</h2>
          <img
            src={previewUrl}
            alt="Uploaded Preview"
            className="w-64 h-auto mt-2 rounded border shadow"
          />
          <p className="mt-2 text-sm text-gray-600">CID: {cid}</p>
          <p className="text-sm text-gray-600">Product: {name}</p>
          <p className="text-sm text-gray-600">Farmer: {farmer}</p>
        </div>
      )}
    </main>
  );
}
