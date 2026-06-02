import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime", // MOV
      "video/x-matroska", // MKV
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" not supported. Allowed: PDF, images, videos (MP4, WebM, MOV)` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isVideo = file.type.startsWith("video/");

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      format: string;
      pages?: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: isVideo ? "video" : "auto",
          folder: isVideo ? "regenscan-videos" : "regenscan-studies",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string; public_id: string; format: string });
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
    });
  } catch (error: unknown) {
    console.error("Upload error details:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("Error message:", message);
    return NextResponse.json(
      { error: message, details: String(error) },
      { status: 500 }
    );
  }
}
