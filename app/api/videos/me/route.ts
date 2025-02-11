import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const videos = await Video.find({ uploaderId: session.user.id }).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
