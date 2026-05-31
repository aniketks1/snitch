import { createBrowserRouter, Navigate } from "react-router";
import Protected from "../shared/components/Protected.jsx";

// Layouts
import App from "./App";
import AuthLayout from "../features/auth/components/AuthLayout";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import ShopLayout from "../shared/components/ShopLayout.jsx";

// Page Components
import Home from "../features/dashboard/pages/Home/Home.jsx";
import Login from "../features/auth/pages/login/Login";
import Register from "../features/auth/pages/register/Register";
import Dashboard from "../features/dashboard/pages/Dashboard/Dashboard";
import CreateProduct from "../features/dashboard/pages/CreateProduct/CreateProduct";
import EditProduct from "../features/dashboard/pages/EditProduct/EditProduct";
import ProductDetails from "../features/dashboard/pages/ProductDetails/ProductDetails";
import Cart from "../features/cart/pages/Cart.jsx";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			// Wrap catalog routes inside the unified ShopLayout
			{
				path: "",
				element: <ShopLayout />,
				children: [
					{
						index: true,
						element: <Home />,
					},
					{
						path: "product/:productId",
						element: <ProductDetails />,
					},
					{
						path: "cart",
						element: <Cart />,
					},
				],
			},

			// auth routes
			{
				path: "auth",
				element: <AuthLayout />,
				children: [
					{
						index: true,
						element: (
							<Navigate
								to="/auth/login"
								replace
							/>
						),
					},
					{
						path: "register",
						element: <Register />,
					},
					{
						path: "login",
						element: <Login />,
					},
				],
			},

			// dashboard routes
			{
				path: "dashboard",
				element: (
					<Protected allowedRoles={["seller"]}>
						<DashboardLayout />
					</Protected>
				),
				children: [
					{
						index: true,
						element: <Dashboard />,
					},
					{
						path: "create-product",
						element: <CreateProduct />,
					},
					{
						path: "edit-product/:productId",
						element: <EditProduct />,
					},
				],
			},
		],
	},
	// not found routes
	{
		path: "*",
		element: <NotFound />,
	},
]);

export default router;
