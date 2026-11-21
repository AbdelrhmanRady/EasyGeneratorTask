export interface AppLog {
  operation: string;
  userId?: string | null;
  resourceId?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}
