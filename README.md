# 📦 Pinata IPFS Upload & Preview (Private Gateway) - Next.js

This is a full-stack Next.js app that allows you to:

- Upload files to IPFS via **Pinata** using **JWT-authenticated signed URLs**
- Use a **private Pinata gateway** to securely access IPFS content
- Add custom metadata (e.g., product name, farmer name)
- Preview uploaded private files using `createAccessLink()`

---

## 🔧 Tech Stack

- **Next.js 15 App Router**
- **Pinata SDK** (File uploads + Gateway access)
- **TailwindCSS** for styling (optional)
- `FormData`, `fetch`, and standard Web APIs

---

## 📂 Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── url/route.ts          # Generates signed upload URL
│   │   └── preview/route.ts      # Generates access link to view private IPFS content
│   └── page.tsx                  # Client-side upload form and preview
├── utils/
│   └── config.ts                 # Pinata SDK config
├── .env.local                    # JWT and Gateway config
├── README.md                     # This file
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/pinata-ipfs-upload.git
cd pinata-ipfs-upload
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Environment Variables

Create a `.env.local` file in the root:

```env
PINATA_JWT=your-pinata-jwt-token
NEXT_PUBLIC_GATEWAY_URL=https://your-private-gateway.mypinata.cloud
```

> 🔐 JWT can be generated from your Pinata dashboard → **API Keys → New Key**  
> ✨ Gateway is created by default (find it in your **Gateway Settings**)

---

## 🧪 Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ Features

- 🔐 Secure uploads via signed URL (no JWT exposed to client)
- 🔒 Uses private gateway to restrict public access
- 🖼 Image preview with short-lived access links
- 📝 Metadata fields (e.g., product name, farmer name)

---

## 📸 Sample Flow

1. Select a file (image or document)
2. Add product name & farmer name
3. Click **Upload**
4. Image and CID are previewed using a secure access link (valid for 30-60 seconds)

---

## 📦 Deployment

You can deploy it to **Vercel**, **Render**, or any Node.js hosting with environment variable support.

---

## 📚 Docs & References

- [Pinata Docs (2025)](https://docs.pinata.cloud/)
- [Pinata SDK](https://www.npmjs.com/package/pinata)
- [IPFS Concepts](https://docs.ipfs.tech/concepts/what-is-ipfs/)

---

## 👨‍💻 Author

Made by [Rohit Kumar](mailto:rohit@lagomchain.com) for on-chain verification and organic certification platform needs.

---

## 🛡 License

MIT
