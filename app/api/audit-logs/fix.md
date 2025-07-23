# API Utils for Audit Logs Endpoint

Based on the provided API endpoint, I'll create a set of utility functions to interact with this audit logs API. These utils will handle the various query parameters and response formats.

## api-utils.ts

```typescript
import { ApiError } from '@/lib/api-utils';

export interface AuditLog {
  // Define the shape of your audit log based on your schema
  id: string;
  action: string;
  entityType: string;
  userId: string;
  teamId?: string;
  projectId?: string;
  createdAt: Date;
  // Add other fields from your schema as needed
}

export interface AuditLogsResponse {
  data: AuditLog[];
  total: number;
  limit: number;
  offset: number;
}

export interface AuditLogsParams {
  action?: string;
  entityType?: string;
  userId?: string;
  teamId?: string;
  projectId?: string;
  from?: Date | string;
  to?: Date | string;
  limit?: number;
  offset?: number;
}

/**
 * Fetches audit logs from the API
 * @param params Query parameters for filtering logs
 * @returns Promise<AuditLogsResponse>
 */
export async function fetchAuditLogs(params: AuditLogsParams = {}): Promise<AuditLogsResponse> {
  try {
    // Convert Date objects to ISO strings if needed
    const fromParam = params.from instanceof Date ? params.from.toISOString() : params.from;
    const toParam = params.to instanceof Date ? params.to.toISOString() : params.to;

    const queryParams = new URLSearchParams();

    if (params.action) queryParams.append('action', params.action);
    if (params.entityType) queryParams.append('entityType', params.entityType);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.teamId) queryParams.append('teamId', params.teamId);
    if (params.projectId) queryParams.append('projectId', params.projectId);
    if (fromParam) queryParams.append('from', fromParam);
    if (toParam) queryParams.append('to', toParam);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`/api/audit-logs?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData.message || 'Failed to fetch audit logs');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'An unexpected error occurred while fetching audit logs');
  }
}

/**
 * Fetches all audit logs by automatically paginating through results
 * @param params Initial query parameters
 * @param batchSize Number of logs to fetch per request (default: 100)
 * @returns Promise<AuditLog[]>
 */
export async function fetchAllAuditLogs(
  params: AuditLogsParams = {},
  batchSize = 100
): Promise<AuditLog[]> {
  let offset = params.offset || 0;
  const limit = batchSize;
  let allLogs: AuditLog[] = [];
  let total = Infinity;

  while (allLogs.length < total) {
    const response = await fetchAuditLogs({
      ...params,
      limit,
      offset,
    });

    allLogs = [...allLogs, ...response.data];
    total = response.total;
    offset += limit;

    // If we got fewer logs than requested, we've reached the end
    if (response.data.length < limit) {
      break;
    }
  }

  return allLogs;
}

/**
 * Helper to format date range parameters
 */
export function formatDateRangeParams(from?: Date | string, to?: Date | string) {
  return {
    from: from instanceof Date ? from.toISOString() : from,
    to: to instanceof Date ? to.toISOString() : to,
  };
}
```

## Usage Examples

Here's how you would use these utilities in your application:

```typescript
import { fetchAuditLogs, fetchAllAuditLogs, AuditLogsParams } from '@/lib/api/audit-logs-utils';

// Example 1: Basic fetch with pagination
async function getRecentLogs() {
  try {
    const response = await fetchAuditLogs({
      limit: 10,
      offset: 0,
    });
    console.log('Recent logs:', response.data);
  } catch (error) {
    console.error('Failed to fetch logs:', error);
  }
}

// Example 2: Filtered fetch
async function getUserLogs(userId: string) {
  try {
    const response = await fetchAuditLogs({
      userId,
      limit: 50,
    });
    console.log('User logs:', response.data);
  } catch (error) {
    console.error('Failed to fetch user logs:', error);
  }
}

// Example 3: Fetch all logs (auto-paginate)
async function getAllProjectLogs(projectId: string) {
  try {
    const allLogs = await fetchAllAuditLogs({
      projectId,
    });
    console.log('All project logs:', allLogs);
  } catch (error) {
    console.error('Failed to fetch all project logs:', error);
  }
}

// Example 4: Date range filtering
async function getLogsInDateRange(from: Date, to: Date) {
  try {
    const response = await fetchAuditLogs({
      ...formatDateRangeParams(from, to),
    });
    console.log('Logs in date range:', response.data);
  } catch (error) {
    console.error('Failed to fetch logs in date range:', error);
  }
}
```

## Type Extensions

If you're using TypeScript, you might want to extend the types to match your exact schema:

```typescript
// types/audit-logs.ts
export type AuditLogAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  // Add other action types as needed
  | string;

export type AuditLogEntityType =
  | 'user'
  | 'team'
  | 'project'
  // Add other entity types as needed
  | string;

export interface AuditLog {
  id: string;
  action: AuditLogAction;
  entityType: AuditLogEntityType;
  entityId?: string;
  userId: string;
  userEmail?: string;
  teamId?: string;
  projectId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt?: Date;
}
```

These utilities provide a type-safe way to interact with your audit logs API endpoint, handling all the query parameters and response formats shown in your original code. The `fetchAllAuditLogs` function is particularly useful when you need to retrieve all logs without worrying about pagination.
