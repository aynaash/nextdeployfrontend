import { broadcastToUser } from '@/app/api/ws/route';

// Add to PUT/PATCH handler
const [updatedDeployment] = await db.update(deployments)
  .set({
    status: body.status,
    updatedAt: new Date()
  })
  .where(eq(deployments.id, params.deploymentId))
  .returning();

// Notify all team members of status change
const teamMembers = await db.select({ userId: teamMembers.userId })
  .from(teamMembers)
  .leftJoin(projects, eq(projects.teamId, teamMembers.teamId))
  .leftJoin(deployments, eq(deployments.projectId, projects.id))
  .where(eq(deployments.id, params.deploymentId));

teamMembers.forEach(({ userId }) => {
  broadcastToUser(userId, 'deployment:update', updatedDeployment);
});

return successResponse(updatedDeployment);
