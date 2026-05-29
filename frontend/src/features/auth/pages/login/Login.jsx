import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../../hook/useAuth";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import PasswordField from "../../../../shared/components/PasswordField";
import Input from "../../../../shared/components/Input";
import Button from "../../../../shared/components/Button";
import AuthPageMobileNav from "../../components/AuthPageMobileNav";
import { RiMailLine } from "@remixicon/react";
import "./Login.css";

const Login = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });

	const { handleLogin } = useAuth();
	const { loading, error } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	const [successMsg, setSuccessMsg] = useState("");

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccessMsg("");

		await handleLogin({
			email: formData.email,
			password: formData.password,
		});
	};

	return (
		<>
			{/* Navigation back home visible only on mobile/tablet */}
			<AuthPageMobileNav />

			{/* Login Form (Borderless, seamlessly integrated directly into the blurred panel) */}
			<div className="w-full max-w-lg p-2 sm:p-4 animate-fade-in-up">
				{/* Title Headers */}
				<div className="mb-8">
					<h2 className="text-2xl sm:text-3xl font-light tracking-wide text-zinc-900 uppercase">Sign In</h2>
					<p className="mt-2 text-sm font-light text-zinc-500 leading-relaxed">
						Welcome back. Sign in to access your bag, favorites, and account details.
					</p>
				</div>

				{/* Success Message Banner */}
				{successMsg && (
					<div className="mb-6 p-4 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm font-light flex items-center gap-3">
						<span className="h-1.5 w-1.5 rounded-full bg-zinc-900 animate-pulse shrink-0"></span>
						{successMsg}
					</div>
				)}

				{/* Error Message Banner */}
				{error && (
					<div className="mb-6 p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-rose-600 text-sm font-light flex items-center gap-3">
						<span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0"></span>
						{error}
					</div>
				)}

				{/* Main Login Form */}
				<form
					onSubmit={handleSubmit}
					className="space-y-5"
				>
					{/* 1. Email Field */}
					<Input
						label="Email Address"
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						placeholder="alexis@snitch.io"
						required={true}
						disabled={loading}
						icon={RiMailLine}
					/>

					{/* 2. Password Field */}
					<PasswordField
						label="Password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
						disabled={loading}
						showForgot={true}
					/>

					{/* Login Submit Button */}
					<Button
						type="submit"
						id="btnLogin"
						variant="auth"
						fullWidth={true}
						className="mt-8"
						isLoading={loading}
						loadingText="Signing In..."
					>
						Sign In
					</Button>
				</form>

				{/* Muted Divider */}
				<div className="flex items-center my-6">
					<div className="grow border-t border-zinc-200"></div>
					<span className="shrink mx-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
						or continue with
					</span>
					<div className="grow border-t border-zinc-200"></div>
				</div>

				{/* Google Sign In Button */}
				<GoogleAuthButton disabled={loading} />

				{/* Form Link Subtext */}
				<div className="mt-8 text-center text-xs text-zinc-500">
					Don't have an account?{" "}
					<Link
						to="/auth/register"
						className="font-semibold text-zinc-600 hover:text-zinc-900 transition-colors uppercase tracking-wider"
					>
						Sign Up
					</Link>
				</div>
			</div>
		</>
	);
};

export default Login;
