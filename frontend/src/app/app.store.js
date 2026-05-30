import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice.js";
import productReducer from "../features/dashboard/states/product.slice.js";

const store = configureStore({
	reducer: {
		auth: authReducer,
		products: productReducer,
	},
});

export default store;
