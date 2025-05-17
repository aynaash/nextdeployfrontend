import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { ApiError, handleApiError, successResponse, noContentResponse } from '@/lib/api-utils';
import { requireAuth } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await requireAuth();
    
    // Users can only view their own profile unless they're admin
    if (currentUser.id !== params.userId && currentUser.role !== 'admin') {
      throw new ApiError('Forbidden', 403);
    }
    
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, params.userId))
      .limit(1);
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    
    // Users can only update their own profile unless they're admin
    if (currentUser.id !== params.userId && currentUser.role !== 'admin') {
      throw new ApiError('Forbidden', 403);
    }
    
    const [user] = await db.update(users)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(users.id, params.userId))
      .returning();
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await requireAdmin();
    
    const [user] = await db.delete(users)
      .where(eq(users.id, params.userId))
      .returning();
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    
    return noContentResponse();
    
  } catch (error) {
    return handleApiError(error);
  }
}
