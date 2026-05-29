import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import NotFound from "./pages/NotFound";
import Home from "../features/home/pages/Home";
import Login from "../features/auth/pages/login/Login";
import Register from "../features/auth/pages/register/Register";
import AuthLayout from "../features/auth/components/AuthLayout";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import Dashboard from "../features/dashboard/pages/Dashboard/Dashboard";
import CreateProduct from "../features/dashboard/pages/CreateProduct/CreateProduct";

import Protected from "../shared/components/Protected.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			// home routes
			{
				index: true,
				element: <Home />,
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
