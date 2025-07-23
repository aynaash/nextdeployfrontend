// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { ApiError, handleApiError, successResponse } from '@/lib/api-utils';
// import { requireAuth } from '@/lib/auth';
//
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });
//
// export async function POST(request: Request) {
//   try {
//     const user = await requireAuth();
//     const { fileName, fileType } = await request.json();
//
//     if (!fileName || !fileType) {
//       throw new ApiError('File name and type are required', 400);
//     }
//
//     const key = `uploads/${user.id}/${Date.now()}-${fileName}`;
//
//     const command = new PutObjectCommand({
//       Bucket: process.env.S3_BUCKET_NAME,
//       Key: key,
//       ContentType: fileType,
//       ACL: 'private',
//     });
//
//     const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
//
//     return successResponse({
//       signedUrl,
//       key,
//       publicUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
//     });
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
