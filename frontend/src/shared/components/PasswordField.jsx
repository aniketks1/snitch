import { useState } from "react";
import { RiLockLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import "./sharedComponents.css";

const PasswordField = ({
	label = "Password",
	id = "password",
	name = "password",
	value,
	onChange,
	placeholder = "••••••••",
	required = true,
	disabled = false,
	error = "",
	showForgot = false,
	forgotHref = "#forgot",
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-1.5">
				<label
					htmlFor={id}
					className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
				>
					{label}
				</label>
				{showForgot && (
					<a
						href={forgotHref}
						className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest"
					>
						Forgot?
					</a>
				)}
			</div>

			<div className="form-input-container">
				<input
					type={showPassword ? "text" : "password"}
					id={id}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className={`form-input ${error ? "border-rose-500/50 focus:border-rose-500" : ""}`}
					required={required}
					disabled={disabled}
					{...props}
				/>
				<RiLockLine
					size={16}
					className="form-input-icon"
				/>
				<button
					type="button"
					onClick={togglePasswordVisibility}
					className="form-input-toggle focus:outline-none"
					tabIndex="-1"
					aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
				>
					{showPassword ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
				</button>
			</div>

			{error && (
				<p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
					<span className="h-1 w-1 rounded-full bg-rose-400"></span>
					{error}
				</p>
			)}
		</div>
	);
};

export default PasswordField;
