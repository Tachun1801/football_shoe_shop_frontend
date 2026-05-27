import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  },
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('cartItems') || '[]')
  },
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((current) => current.variantId === item.variantId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    setItemQuantity: (state, action) => {
      const { variantId, quantity } = action.payload;
      const existing = state.items.find((current) => current.variantId === variantId);
      if (existing) {
        existing.quantity = Math.max(1, quantity);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((current) => current.variantId !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cartItems');
    }
  }
});

export const { setAuth, clearAuth } = authSlice.actions;
export const { addItem, setItemQuantity, removeItem, clearCart } = cartSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer
  }
});
