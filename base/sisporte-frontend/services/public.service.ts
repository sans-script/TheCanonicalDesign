import api from '../lib/api';
import { Guard } from '../lib/types';

export const publicService = {
  async validateToken(token: string) {
    
    const response = await api.get<Guard>(`/validate/${token}`);
    return response.data;
  }
};
