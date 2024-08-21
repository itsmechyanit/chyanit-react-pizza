import { configureStore } from '@reduxjs/toolkit';

import { userSlice } from './features/user/userSlice';

import { cartSlice } from './features/cart/cartSlice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    cart: cartSlice.reducer,
  },
});

export default store;
