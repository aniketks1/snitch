import {
	createProductApi,
	getSellerProductsApi,
	getAllProductsApi,
	getProductDetailsApi,
} from "../services/product.api.js";
import { useDispatch } from "react-redux";
import { setProducts, setSellerProducts } from "../states/product.slice.js";

const useProducts = () => {
	const dispatch = useDispatch();

	async function handleCreateProduct({ title, description, priceAmount, priceCurrency, images }) {
		const data = await createProductApi({ title, description, priceAmount, priceCurrency, images });
		return data.product;
	}

	async function handleGetSellerProduct() {
		const data = await getSellerProductsApi();
		dispatch(setSellerProducts(data.products));
		return data.products;
	}

	async function handleGetAllProducts() {
		const data = await getAllProductsApi();
		dispatch(setProducts(data.products));
		return data.products;
	}

	async function handleGetProductDetails({ productId }) {
		const data = await getProductDetailsApi({ productId });
		return data.product;
	}

	return { handleCreateProduct, handleGetSellerProduct, handleGetAllProducts, handleGetProductDetails };
};

export default useProducts;
