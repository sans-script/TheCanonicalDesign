import api from '../lib/api';
import { Guard } from '../lib/types';

export const guardsService = {
  async getAll(
    status?: string,
    cardFilter?: string,
    search?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const response = await api.get<{ data: Guard[], total: number, page: number, totalPages: number }>('/guards', {
      params: { status, cardFilter, search, page, limit }
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<Guard>(`/guards/${id}`);
    return response.data;
  },

  async getSignedUrl(path: string) {
    const response = await api.get<{ url: string }>('/guards/signed-url', {
      params: { path }
    });
    return response.data.url;
  },

  async create(data: Partial<Guard>) {
    const response = await api.post<Guard>('/guards', data);
    return response.data;
  },

  async update(id: string, data: Partial<Guard>) {
    const response = await api.put<Guard>(`/guards/${id}`, data);
    return response.data;
  },

  async delete(id: string, password?: string) {
    const response = await api.delete(`/guards/${id}`, { data: { password } });
    return response.data;
  },

  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  async addCertificate(guardId: string, data: any) {
    const response = await api.post(`/guards/${guardId}/certificates`, data);
    return response.data;
  },

  async removeCertificate(guardId: string, certId: string) {
    const response = await api.delete(`/guards/${guardId}/certificates/${certId}`);
    return response.data;
  },

  async addEquipment(guardId: string, data: any) {
    const response = await api.post(`/guards/${guardId}/equipments`, data);
    return response.data;
  },

  async removeEquipment(guardId: string, equipId: string) {
    const response = await api.delete(`/guards/${guardId}/equipments/${equipId}`);
    return response.data;
  },

  async addPsychologicalEvaluation(guardId: string, data: any) {
    const response = await api.post(`/guards/${guardId}/psychological-evaluations`, data);
    return response.data;
  },

  async removePsychologicalEvaluation(guardId: string, evalId: string) {
    const response = await api.delete(`/guards/${guardId}/psychological-evaluations/${evalId}`);
    return response.data;
  },

  async updateCertificate(guardId: string, certId: string, data: any) {
    const response = await api.put(`/guards/${guardId}/certificates/${certId}`, data);
    return response.data;
  },

  async updateEquipment(guardId: string, equipId: string, data: any) {
    const response = await api.put(`/guards/${guardId}/equipments/${equipId}`, data);
    return response.data;
  },

  async updatePsychologicalEvaluation(guardId: string, evalId: string, data: any) {
    const response = await api.put(`/guards/${guardId}/psychological-evaluations/${evalId}`, data);
    return response.data;
  },

  async generateBatchPdf(guardIds: string[], trackingId?: string) {
    const response = await api.post('/guards/batch-pdf', { guardIds, trackingId }, {
      responseType: 'blob'
    });
    return response.data;
  },

  async getExportProgress(id: string) {
    const response = await api.get<{ progress: number }>(`/guards/export-progress/${id}`);
    return response.data.progress;
  }
};
