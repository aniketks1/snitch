import { addToCartApi, getCartApi } from "../services/cart.api.js";
import { useDispatch } from "react-redux";
import { setItems } from "../state/cart.slice.js";

export const useCart = () => {
	const dispatch = useDispatch();
	async function handleAddItem({ productId, variantId, quantity }) {
		try {
			const data = await addToCartApi({ productId, variantId, quantity });
			if (data && data.cart) {
				dispatch(setItems(data.cart.items));
			}
			return data;
		} catch (error) {
			console.error("Failed adding to cart in hook:", error);
			throw error;
		}
	}

	async function handleGetCart() {
		try {
			const data = await getCartApi();
			if (data && data.cart) {
				dispatch(setItems(data.cart.items));
			}
			return data;
		} catch (error) {
			console.error("Failed fetching cart in hook:", error);
			throw error;
		}
	}

	return { handleAddItem, handleGetCart };
};
