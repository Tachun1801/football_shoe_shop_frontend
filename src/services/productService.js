import api from './api';

export async function listProducts(search = '') {
  const response = await api.get('/products', {
    params: search ? { search } : {}
  });
  return response.data;
}

export async function getProduct(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function getProductReviews(id) {
  const response = await api.get(`/products/${id}/reviews`);
  return response.data;
}

export async function saveProduct(payload, id = null) {
  const url = id ? `/admin/products/${id}` : '/admin/products';
  const method = id ? 'put' : 'post';
  const response = await api[method](url, payload);
  return response.data;
}

export async function deleteProduct(id) {
  await api.delete(`/admin/products/${id}`);
}
