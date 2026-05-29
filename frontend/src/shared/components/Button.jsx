import { Link } from "react-router";
import "./sharedComponents.css";

const Button = ({
	children,
	type = "button",
	variant = "primary", // 'primary' | 'auth' | 'danger'
	fullWidth = false,
	disabled = false,
	isLoading = false,
	loadingText,
	to,
	onClick,
	className = "",
	...props
}) => {
	const baseClass = "btn-base";
	const variantClass = variant === "auth" ? "btn-auth" : variant === "danger" ? "btn-danger" : "btn-primary";

	const widthClass = fullWidth ? "w-full" : "";
	const disabledClass = disabled || isLoading ? "btn-disabled" : "";

	const combinedClasses = `${baseClass} ${variantClass} ${widthClass} ${disabledClass} ${className}`.trim();

	const spinnerBorderColor = variant === "danger" ? "border-zinc-100" : "border-zinc-950";

	const renderContent = () => {
		if (isLoading) {
			return (
				<>
					<span
						className={`w-4 h-4 border-2 ${spinnerBorderColor} border-t-transparent rounded-full animate-spin shrink-0`}
					></span>
					{loadingText || children}
				</>
			);
		}
		return children;
	};

	// Render React Router Link if "to" prop is passed
	if (to) {
		return (
			<Link
				to={to}
				className={combinedClasses}
				{...props}
			>
				{renderContent()}
			</Link>
		);
	}

	// Default button render
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || isLoading}
			className={combinedClasses}
			{...props}
		>
			{renderContent()}
		</button>
	);
};

export default Button;
