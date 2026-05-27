import api from './api';

export async function createReview(payload) {
  const response = await api.post('/reviews', payload);
  return response.data;
}
