import "./sharedComponents.css";

const Input = ({
	label,
	type = "text",
	id,
	name,
	value,
	onChange,
	placeholder,
	required = false,
	disabled = false,
	icon: Icon,
	error = "",
	className = "",
	...props
}) => {
	return (
		<div>
			{label && (
				<label
					htmlFor={id}
					className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5"
				>
					{label}
				</label>
			)}
			<div className="form-input-container">
				<input
					type={type}
					id={id}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className={`form-input ${error ? "border-rose-500/50 focus:border-rose-500" : ""} ${className}`}
					required={required}
					disabled={disabled}
					{...props}
				/>
				{Icon && (
					<Icon
						size={16}
						className="form-input-icon"
					/>
				)}
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

export default Input;
