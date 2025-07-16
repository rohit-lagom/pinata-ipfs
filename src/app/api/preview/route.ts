import { NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cid = searchParams.get("cid");

  if (!cid) {
    return NextResponse.json({ error: "CID is required" }, { status: 400 });
  }

  try {
    const url = await pinata.gateways.private.createAccessLink({
      cid,
      expires: 60, // valid for 60 seconds
    });

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get access link" }, { status: 500 });
  }
}
