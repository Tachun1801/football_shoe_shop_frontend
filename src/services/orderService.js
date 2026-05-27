import api from './api';

export async function createOrder(payload) {
  const response = await api.post('/orders', payload);
  return response.data;
}

export async function listOrders() {
  const response = await api.get('/orders');
  return response.data;
}

export async function getOrder(id) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export async function updateOrderStatus(id, status) {
  const response = await api.put(`/admin/orders/${id}/status`, null, {
    params: { status }
  });
  return response.data;
}
