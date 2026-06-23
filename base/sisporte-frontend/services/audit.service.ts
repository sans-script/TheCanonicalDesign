import api from '../lib/api';

export interface AuditLog {
  id: string;
  userId: string | null;
  user?: {
    name: string | null;
    email: string;
  };
  entity: string;
  entityId: string;
  action: string;
  oldData: any;
  newData: any;
  ipAddress: string | null;
  createdAt: string;
}

export const auditService = {
  async getAll() {
    const response = await api.get<AuditLog[]>('/audit');
    return response.data;
  },
};
