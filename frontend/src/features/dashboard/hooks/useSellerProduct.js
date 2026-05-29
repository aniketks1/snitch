import { createProductApi, getSellerProductsApi } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts } from "../states/product.slice.js";

const useSellerProduct = () => {
	const dispatch = useDispatch();

	async function handleCreateProduct({ title, description, priceAmount, priceCurrency, images }) {
		const data = await createProductApi({ title, description, priceAmount, priceCurrency, images });
		return data.product;
	}

	async function handlerGetSellerProduct() {
		const data = await getSellerProductsApi();
		dispatch(setSellerProducts(data.products));
		return data.products;
	}

	return { handleCreateProduct, handlerGetSellerProduct };
};

export default useSellerProduct;
