import { db } from '@/lib/db';
import { teamMembers, users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { ApiError, handleApiError, successResponse, createdResponse } from '@/lib/api-utils';
import { requireAuth } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const user = await requireAuth();
    
    // Check if user is a member of the team
    const [membership] = await db.select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, params.teamId),
          eq(teamMembers.userId, user.id)
        )
      .limit(1);
    
    if (!membership) {
      throw new ApiError('Forbidden', 403);
    }
    
    const members = await db.query.teamMembers.findMany({
      where: eq(teamMembers.teamId, params.teamId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });
    
    return successResponse(members);
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const user = await requireAuth();
    const { email, role } = await request.json();
    
    // Check if current user is a team admin/owner
    const [membership] = await db.select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, params.teamId),
          eq(teamMembers.userId, user.id),
          or(
            eq(teamMembers.role, 'owner'),
            eq(teamMembers.role, 'admin')
          )
        )
      )
      .limit(1);
    
    if (!membership) {
      throw new ApiError('Forbidden', 403);
    }
    
    // Find user by email
    const [invitee] = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!invitee) {
      throw new ApiError('User not found', 404);
    }
    
    // Check if user is already a member
    const [existingMember] = await db.select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, params.teamId),
          eq(teamMembers.userId, invitee.id)
        )
      .limit(1);
    
    if (existingMember) {
      throw new ApiError('User is already a team member', 409);
    }
    
    const [newMember] = await db.insert(teamMembers)
      .values({
        teamId: params.teamId,
        userId: invitee.id,
        role,
        invitedByUserId: user.id,
        status: 'pending',
        joinedAt: new Date()
      })
      .returning();
    
    return createdResponse(newMember);
    
  } catch (error) {
    return handleApiError(error);
  }
}
