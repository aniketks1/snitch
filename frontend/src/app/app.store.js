import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice.js";
import sellerProductReducer from "../features/dashboard/states/product.slice.js";

const store = configureStore({
	reducer: {
		auth: authReducer,
		sellerProduct: sellerProductReducer,
	},
});

export default store;
