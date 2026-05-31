import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice.js";
import productReducer from "../features/dashboard/states/product.slice.js";
import cartReducer from "../features/cart/state/cart.slice.js";

const store = configureStore({
	reducer: {
		auth: authReducer,
		products: productReducer,
		cart: cartReducer,
	},
});

export default store;
