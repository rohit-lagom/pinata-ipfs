import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cid = searchParams.get("cid");

  if (!cid) {
    return NextResponse.json({ error: "CID is required" }, { status: 400 });
  }

  try {
    const pinataJwt = process.env.PINATA_JWT;
    const gatewayUrl = `https://silver-absolute-crow-885.mypinata.cloud/ipfs/${cid}`;

    const pinataRes = await fetch(gatewayUrl, {
      headers: {
        Authorization: `Bearer ${pinataJwt}`,
      },
    });

    if (!pinataRes.ok) {
      return NextResponse.json({ error: "Failed to fetch from gateway" }, { status: pinataRes.status });
    }

    const contentType = pinataRes.headers.get("content-type") || "application/octet-stream";
    const buffer = await pinataRes.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
