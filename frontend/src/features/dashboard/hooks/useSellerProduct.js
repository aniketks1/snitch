import {
	createProductApi,
	getSellerProductsApi,
	getAllProductsApi,
	getProductDetailsApi,
	updateProductApi,
} from "../services/product.api.js";
import { useDispatch } from "react-redux";
import { setProducts, setSellerProducts } from "../states/product.slice.js";

const useProducts = () => {
	const dispatch = useDispatch();

	async function handleCreateProduct({ title, description, priceAmount, priceCurrency, images, variants, variantImages }) {
		const data = await createProductApi({ title, description, priceAmount, priceCurrency, images, variants, variantImages });
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

	async function handleUpdateProduct(payload) {
		const data = await updateProductApi(payload);
		return data;
	}

	return { handleCreateProduct, handleGetSellerProduct, handleGetAllProducts, handleGetProductDetails, handleUpdateProduct };
};

export default useProducts;
