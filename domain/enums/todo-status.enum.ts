export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const TODO_STATUS = {
  PENDING: 'pending' as const,
  IN_PROGRESS: 'in_progress' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const,
};

export type TodoStatusType = typeof TODO_STATUS[keyof typeof TODO_STATUS];
