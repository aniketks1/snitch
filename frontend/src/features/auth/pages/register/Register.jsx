import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hook/useAuth";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import PasswordField from "../../../../shared/components/PasswordField";
import Input from "../../../../shared/components/Input";
import Button from "../../../../shared/components/Button";
import AuthPageMobileNav from "../../components/AuthPageMobileNav";
import { RiUserLine, RiMailLine, RiPhoneLine } from "@remixicon/react";
import "./Register.css";

const Register = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		contact: "",
		password: "",
		confirmPassword: "",
		isSeller: false,
	});

	const { handleRegister } = useAuth();
	const navigate = useNavigate();

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");

	// Real-time password matching validation
	useEffect(() => {
		if (formData.confirmPassword) {
			if (formData.password !== formData.confirmPassword) {
				setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
			} else {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors.confirmPassword;
					return newErrors;
				});
			}
		} else {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors.confirmPassword;
				return newErrors;
			});
		}
	}, [formData.password, formData.confirmPassword]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setErrors({ confirmPassword: "Passwords do not match" });
			return;
		}

		// console.log(formData);

		try {
			await handleRegister({
				email: formData.email,
				contact: formData.contact,
				password: formData.password,
				fullName: formData.fullName,
				isSeller: formData.isSeller,
			});
			setSuccessMsg("Registered successfully! Welcome to SNITCH.");
			navigate("/dashboard");
		} catch (error) {
			setErrors({ message: error.response?.data?.message });
			setSuccessMsg(error.message);
		}
	};

	return (
		<>
			{/* Navigation back home visible only on mobile/tablet */}
			<AuthPageMobileNav />

			{/* Registration Form (Seamlessly integrated directly into the blended panel) */}
			<div className="w-full max-w-lg p-2 sm:p-4 animate-fade-in-up">
				{/* Title Headers */}
				<div className="mb-8">
					<h2 className="text-2xl sm:text-3xl font-light tracking-wide text-zinc-900 uppercase">
						Create Account
					</h2>
					<p className="mt-2 text-sm font-light text-zinc-500 leading-relaxed">
						Join Snitch to track orders, save curation favorites, and get priority access to seasonal drops.
					</p>
				</div>

				{/* Success Message Banner */}
				{successMsg && (
					<div className="mb-6 p-4 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm font-light flex items-center gap-3">
						<span className="h-1.5 w-1.5 rounded-full bg-zinc-900 animate-pulse shrink-0"></span>
						{successMsg}
					</div>
				)}

				{/* Main Register Form */}
				<form
					onSubmit={handleSubmit}
					className="space-y-5"
				>
					{/* 1. Full Name Field */}
					<Input
						label="Full Name"
						type="text"
						id="fullName"
						name="fullName"
						value={formData.fullName}
						onChange={handleInputChange}
						placeholder="e.g. Alexis Carter"
						required={true}
						disabled={isSubmitting}
						icon={RiUserLine}
					/>

					{/* 2. Email Field */}
					<Input
						label="Email Address"
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						placeholder="alexis@snitch.io"
						required={true}
						disabled={isSubmitting}
						icon={RiMailLine}
					/>

					{/* 3. Contact Number Field */}
					<Input
						label="Contact Number"
						type="tel"
						id="contact"
						name="contact"
						value={formData.contact}
						onChange={handleInputChange}
						placeholder="1234567890"
						required={false}
						disabled={isSubmitting}
						icon={RiPhoneLine}
					/>

					{/* 4. Password Field */}
					<PasswordField
						label="Password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
						disabled={isSubmitting}
					/>

					{/* 5. Confirm Password Field */}
					<PasswordField
						label="Confirm Password"
						id="confirmPassword"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleInputChange}
						disabled={isSubmitting}
						error={errors.confirmPassword}
					/>

					{/* 6. Checkbox 'are you a seller?' */}
					<div className="flex items-center space-x-3 pt-1">
						<input
							type="checkbox"
							id="isSeller"
							name="isSeller"
							checked={formData.isSeller}
							onChange={handleInputChange}
							className="custom-checkbox"
							disabled={isSubmitting}
						/>
						<label
							htmlFor="isSeller"
							className="text-xs sm:text-sm text-zinc-500 select-none cursor-pointer hover:text-zinc-900 transition-colors"
						>
							Are you a seller?
						</label>
					</div>

					{/* Register Submit Button */}
					<Button
						type="submit"
						id="btnRegister"
						variant="auth"
						fullWidth={true}
						className="mt-6"
						isLoading={isSubmitting}
						loadingText="Registering..."
						disabled={!!errors.confirmPassword}
					>
						Register Account
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
				<GoogleAuthButton disabled={isSubmitting} />

				{/* Form Link Subtext */}
				<div className="mt-8 text-center text-xs text-zinc-500">
					Already have an account?{" "}
					<Link
						to="/auth/login"
						className="font-semibold text-zinc-600 hover:text-zinc-900 transition-colors uppercase tracking-wider"
					>
						Sign In
					</Link>
				</div>
			</div>
		</>
	);
};

export default Register;
