import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    await requireAuth(); // Ensure user is authenticated
    
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: params.key,
    });

    const { Body, ContentType } = await s3.send(command);
    
    return new NextResponse(Body, {
      headers: {
        'Content-Type': ContentType || 'application/octet-stream',
      },
    });
  } catch (error) {
    return new NextResponse(null, { status: 404 });
  }
}
