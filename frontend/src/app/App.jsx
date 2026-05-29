import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { useAuth } from "../features/auth/hook/useAuth.js";

import { useState } from "react";

const App = () => {
	const { user } = useSelector((state) => state.auth);
	const { handleGetMe } = useAuth();
	const [isHydrating, setIsHydrating] = useState(true);

	useEffect(() => {
		async function initSession() {
			if (!user) {
				await handleGetMe();
			}
			setIsHydrating(false);
		}
		initSession();
	}, []);

	// While hydrating global user session on initial load, render the premium spinner
	if (isHydrating) {
		return (
			<div className="min-h-screen bg-[#030303] flex items-center justify-center">
				<span className="w-8 h-8 border-2 border-zinc-100 border-t-transparent rounded-full animate-spin shrink-0"></span>
			</div>
		);
	}

	return <Outlet />;
};

export default App;
