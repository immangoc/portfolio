import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function GET() {
  const config = cloudinary.config();
  const hasName = !!config.cloud_name;
  const hasKey = !!config.api_key;
  const hasSecret = !!config.api_secret;

  let pingOk = false;
  let pingError = "";
  try {
    await cloudinary.api.ping();
    pingOk = true;
  } catch (e: unknown) {
    pingError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    cloud_name: config.cloud_name ?? "(missing)",
    api_key: hasKey ? config.api_key : "(missing)",
    api_secret_set: hasSecret,
    ping: pingOk ? "ok" : "fail",
    ping_error: pingError || undefined,
  });
}
