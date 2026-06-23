import api from '../lib/api';
import { UserAccount } from '../lib/types';

export const usersService = {
  async getAll() {
    const response = await api.get<UserAccount[]>('/users');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<UserAccount>(`/users/${id}`);
    return response.data;
  },

  async create(data: Partial<UserAccount> & { password?: string }) {
    const response = await api.post<UserAccount>('/users', data);
    return response.data;
  },

  async update(id: string, data: Partial<UserAccount> & { password?: string }, confirmPassword?: string) {
    const payload = { ...data, confirmPassword };
    const response = await api.patch<UserAccount>(`/users/${id}`, payload);
    return response.data;
  },

  async delete(id: string, password?: string) {
    const response = await api.delete(`/users/${id}`, {
      data: { password }
    });
    return response.data;
  }
};
