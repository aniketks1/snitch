import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import useSellerProduct from "../../hooks/useSellerProduct.js";
import Input from "../../../../shared/components/Input.jsx";
import Button from "../../../../shared/components/Button.jsx";
import {
	RiFileList3Line,
	RiImageAddLine,
	RiCloseLine,
	RiMoneyDollarCircleLine,
	RiCheckLine,
	RiErrorWarningLine,
	RiAddLine,
	RiDeleteBinLine,
	RiStackLine,
} from "@remixicon/react";
import "./CreateProduct.css";

const EMPTY_VARIANT = { stock: "", priceAmount: "", priceCurrency: "", attributes: [{ key: "", value: "" }] };

const CreateProduct = () => {
	const { handleCreateProduct } = useSellerProduct();
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	const [formData, setFormData] = useState({ title: "", description: "", priceAmount: "", priceCurrency: "INR" });
	const [images, setImages] = useState([]);
	const [imagePreviews, setImagePreviews] = useState([]);
	const [isDragActive, setIsDragActive] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	// --- Variants state ---
	const [variants, setVariants] = useState([]);
	const [variantImages, setVariantImages] = useState({}); // { [variantIndex]: File[] }
	const [variantImagePreviews, setVariantImagePreviews] = useState({}); // { [variantIndex]: {id, name, url}[] }

	// Generate object URLs for product images when they are selected
	useEffect(() => {
		if (images.length === 0) {
			setImagePreviews([]);
			return;
		}

		const objectUrls = images.map((image) => ({
			id: Math.random().toString(36).substring(2, 9),
			name: image.name,
			url: URL.createObjectURL(image),
		}));

		setImagePreviews(objectUrls);

		// Clean up memory
		return () => {
			objectUrls.forEach((preview) => URL.revokeObjectURL(preview.url));
		};
	}, [images]);

	// Generate object URLs for variant images
	useEffect(() => {
		const newPreviews = {};
		Object.entries(variantImages).forEach(([index, files]) => {
			if (files && files.length > 0) {
				newPreviews[index] = files.map((file) => ({
					id: Math.random().toString(36).substring(2, 9),
					name: file.name,
					url: URL.createObjectURL(file),
				}));
			} else {
				newPreviews[index] = [];
			}
		});

		// Revoke old previews
		Object.values(variantImagePreviews).forEach((previews) => {
			previews?.forEach((p) => URL.revokeObjectURL(p.url));
		});

		setVariantImagePreviews(newPreviews);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [variantImages]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Uploader drag and drop events
	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setIsDragActive(true);
		} else if (e.type === "dragleave") {
			setIsDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const filesArray = Array.from(e.dataTransfer.files);
			// Filter to ensure only image files are loaded
			const imageFiles = filesArray.filter((file) => file.type.startsWith("image/"));
			if (imageFiles.length > 0) {
				if (images.length + imageFiles.length > 7) {
					setErrorMsg("Maximum of 7 images only are allowed.");
					const allowedCount = 7 - images.length;
					if (allowedCount > 0) {
						setImages((prev) => [...prev, ...imageFiles.slice(0, allowedCount)]);
					}
				} else {
					setImages((prev) => [...prev, ...imageFiles]);
				}
			}
		}
	};

	const handleFileSelect = (e) => {
		if (e.target.files && e.target.files[0]) {
			const filesArray = Array.from(e.target.files);
			const imageFiles = filesArray.filter((file) => file.type.startsWith("image/"));
			if (imageFiles.length > 0) {
				if (images.length + imageFiles.length > 7) {
					setErrorMsg("Maximum of 7 images only are allowed.");
					const allowedCount = 7 - images.length;
					if (allowedCount > 0) {
						setImages((prev) => [...prev, ...imageFiles.slice(0, allowedCount)]);
					}
				} else {
					setImages((prev) => [...prev, ...imageFiles]);
				}
			}
		}
	};

	const handleRemoveImage = (indexToRemove) => {
		setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
		// Clear uploader limit warning if they delete down
		if (images.length - 1 < 7) {
			setErrorMsg("");
		}
	};

	// --- Variant handlers ---
	const handleAddVariant = () => {
		setVariants((prev) => [...prev, { ...EMPTY_VARIANT, attributes: [{ key: "", value: "" }] }]);
	};

	const handleRemoveVariant = (indexToRemove) => {
		setVariants((prev) => prev.filter((_, i) => i !== indexToRemove));
		setVariantImages((prev) => {
			const next = {};
			// Re-index remaining variants
			Object.keys(prev).forEach((key) => {
				const k = Number(key);
				if (k < indexToRemove) next[k] = prev[k];
				else if (k > indexToRemove) next[k - 1] = prev[k];
			});
			return next;
		});
	};

	const handleVariantChange = (variantIndex, field, value) => {
		setVariants((prev) => prev.map((v, i) => (i === variantIndex ? { ...v, [field]: value } : v)));
	};

	const handleVariantAttributeChange = (variantIndex, attrIndex, field, value) => {
		setVariants((prev) =>
			prev.map((v, i) => {
				if (i !== variantIndex) return v;
				const newAttrs = v.attributes.map((a, ai) => (ai === attrIndex ? { ...a, [field]: value } : a));
				return { ...v, attributes: newAttrs };
			}),
		);
	};

	const handleAddAttribute = (variantIndex) => {
		setVariants((prev) =>
			prev.map((v, i) => (i === variantIndex ? { ...v, attributes: [...v.attributes, { key: "", value: "" }] } : v)),
		);
	};

	const handleRemoveAttribute = (variantIndex, attrIndex) => {
		setVariants((prev) =>
			prev.map((v, i) => (i === variantIndex ? { ...v, attributes: v.attributes.filter((_, ai) => ai !== attrIndex) } : v)),
		);
	};

	const handleVariantFileSelect = (variantIndex, e) => {
		if (e.target.files && e.target.files[0]) {
			const filesArray = Array.from(e.target.files);
			addVariantFiles(variantIndex, filesArray);
		}
	};

	const addVariantFiles = (variantIndex, files) => {
		const imageFiles = files.filter((f) => f.type.startsWith("image/"));
		if (imageFiles.length > 0) {
			setVariantImages((prev) => ({
				...prev,
				[variantIndex]: [...(prev[variantIndex] || []), ...imageFiles].slice(0, 5),
			}));
		}
	};

	const handleVariantDrop = (variantIndex, e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			addVariantFiles(variantIndex, Array.from(e.dataTransfer.files));
		}
	};

	const handleVariantDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleRemoveVariantImage = (variantIndex, imageIndex) => {
		setVariantImages((prev) => ({
			...prev,
			[variantIndex]: (prev[variantIndex] || []).filter((_, i) => i !== imageIndex),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMsg("");
		setSuccessMsg("");

		if (!formData.title.trim()) {
			setErrorMsg("Product title is required.");
			return;
		}
		if (!formData.priceAmount || isNaN(Number(formData.priceAmount))) {
			setErrorMsg("Please enter a valid price amount.");
			return;
		}
		if (images.length === 0) {
			setErrorMsg("Please upload at least one product image.");
			return;
		}

		// Validate variants
		for (let i = 0; i < variants.length; i++) {
			const v = variants[i];
			if (!v.priceAmount || isNaN(Number(v.priceAmount))) {
				setErrorMsg(`Variant ${i + 1}: Please enter a valid price amount.`);
				return;
			}
		}

		setIsSubmitting(true);

		try {
			// Build variant data for API (convert attributes array → object map)
			const variantData = variants.map((v) => ({
				stock: Number(v.stock) || 0,
				priceAmount: Number(v.priceAmount),
				priceCurrency: v.priceCurrency || formData.priceCurrency,
				attributes: Object.fromEntries(v.attributes.filter((a) => a.key.trim()).map((a) => [a.key, a.value])),
			}));

			// Call the seller product service logic
			await handleCreateProduct({
				title: formData.title,
				description: formData.description,
				priceAmount: Number(formData.priceAmount),
				priceCurrency: formData.priceCurrency,
				images: images,
				variants: variantData.length > 0 ? variantData : undefined,
				variantImages: Object.keys(variantImages).length > 0 ? variantImages : undefined,
			});

			setSuccessMsg("Product successfully designed and launched to collections!");
			// Reset states
			setFormData({
				title: "",
				description: "",
				priceAmount: "",
				priceCurrency: "INR",
			});
			setImages([]);
			setVariants([]);
			setVariantImages({});

			// Automatically redirect back to main dashboard after some duration to feel high-end
			setTimeout(() => {
				navigate("/dashboard");
			}, 2500);
		} catch (error) {
			setErrorMsg(error?.message || "Failed to launch product drop. Please check details.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="create-product-container animate-fade-in-up">
			{/* Title Headers */}
			<div className="mb-10 text-center sm:text-left">
				<h2 className="text-3xl font-light tracking-wide text-zinc-900 uppercase">
					Create Product <span className="font-semibold text-zinc-500">Drop</span>
				</h2>
				<p className="mt-2 text-sm font-light text-zinc-500 leading-relaxed max-w-xl">
					Draft and launch your new designs. Provide detailed specifications and premium editorial campaign
					images for the catalog drop.
				</p>
			</div>

			{/* Error Message Banner */}
			{errorMsg && (
				<div className="mb-8 p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-rose-600 text-sm font-light flex items-center gap-3 animate-fade-in-up">
					<RiErrorWarningLine
						size={18}
						className="shrink-0 text-rose-500"
					/>
					{errorMsg}
				</div>
			)}

			{/* Success Message Banner */}
			{successMsg && (
				<div className="mb-8 p-4 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm font-light flex items-center gap-3 animate-fade-in-up">
					<div className="h-6 w-6 rounded-full bg-zinc-950 flex items-center justify-center shrink-0">
						<RiCheckLine
							size={14}
							className="text-zinc-50 font-bold"
						/>
					</div>
					<div className="flex-1">
						<p className="font-semibold text-zinc-900">Drop Launched Successfully</p>
						<p className="text-xs text-zinc-500 mt-0.5">{successMsg} Redirecting to Studio...</p>
					</div>
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="grid grid-cols-1 lg:grid-cols-12 gap-8"
			>
				{/* PART 1: PRODUCT DETAILS INPUTS */}
				<div className="lg:col-span-7 space-y-6 premium-card p-6 sm:p-8">
					<div className="flex items-center pb-4 border-b border-zinc-200 mb-2">
						<span className="section-badge">1</span>
						<h3 className="text-sm font-semibold tracking-wider text-zinc-800 uppercase">
							Product Details
						</h3>
					</div>

					{/* 1. Title Input */}
					<Input
						label="Product Name / Title"
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleInputChange}
						placeholder="e.g. Minimalist Charcoal Trenchcoat"
						required={true}
						disabled={isSubmitting}
						icon={RiFileList3Line}
					/>

					{/* 2. Price and Currency Selector */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
						<div className="sm:col-span-2">
							<Input
								label="Price Amount"
								type="text"
								id="priceAmount"
								name="priceAmount"
								value={formData.priceAmount}
								onChange={handleInputChange}
								placeholder="e.g. 5999"
								required={true}
								disabled={isSubmitting}
								icon={RiMoneyDollarCircleLine}
							/>
						</div>
						<div>
							<label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
								Currency
							</label>
							<div className="relative">
								<select
									name="priceCurrency"
									id="priceCurrency"
									value={formData.priceCurrency}
									onChange={handleInputChange}
									className="form-input premium-select w-full pl-4! bg-white cursor-pointer text-sm outline-none"
									disabled={isSubmitting}
								>
									<option value="INR">INR (₹)</option>
									<option value="USD">USD ($)</option>
									<option value="EUR">EUR (€)</option>
									<option value="GBP">GBP (£)</option>
								</select>
							</div>
						</div>
					</div>

					{/* 3. Description input */}
					<div>
						<label
							htmlFor="description"
							className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder="Describe the fabric blend, tailored cut, stitch details, and stylistic intent of this piece..."
							className="premium-textarea"
							disabled={isSubmitting}
							required
						/>
					</div>
				</div>

				{/* PART 2: IMAGE UPLOAD */}
				<div className="lg:col-span-5 space-y-6 premium-card p-6 sm:p-8 flex flex-col justify-between">
					<div className="space-y-6">
						<div className="flex items-center pb-4 border-b border-zinc-200 mb-2">
							<span className="section-badge">2</span>
							<h3 className="text-sm font-semibold tracking-wider text-zinc-800 uppercase">
								Product Images
							</h3>
						</div>

						{/* Drag & Drop Zone */}
						<div
							className={`uploader-dropzone p-8 text-center flex flex-col items-center justify-center min-h-40 ${
								isDragActive ? "drag-active border-zinc-900" : ""
							} ${images.length >= 7 ? "opacity-50 cursor-not-allowed! border-dashed border-zinc-200 bg-zinc-50" : ""}`}
							onDragEnter={handleDrag}
							onDragOver={handleDrag}
							onDragLeave={handleDrag}
							onDrop={handleDrop}
							onClick={() => {
								if (images.length >= 7) {
									setErrorMsg("Maximum of 7 images only are allowed.");
								} else {
									fileInputRef.current?.click();
								}
							}}
						>
							<input
								ref={fileInputRef}
								type="file"
								multiple
								accept="image/*"
								onChange={handleFileSelect}
								className="hidden"
								disabled={isSubmitting}
							/>
							<div className="p-3.5 rounded-full bg-zinc-50 border border-zinc-200 mb-3 text-zinc-500">
								<RiImageAddLine
									size={20}
									className="animate-pulse"
								/>
							</div>
							<p className="text-xs text-zinc-700 font-semibold uppercase tracking-wider">
								Drag campaign assets here
							</p>
							<p className="text-[10px] text-zinc-500 mt-1 font-light">
								or click to browse local files (JPEG, PNG, WebP)
							</p>
						</div>

						{/* Previews Grid */}
						{imagePreviews.length > 0 && (
							<div className="space-y-3">
								<p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
									Selected Drops ({imagePreviews.length})
								</p>
								<div className="grid grid-cols-3 gap-3">
									{imagePreviews.map((preview, index) => (
										<div
											key={preview.id}
											className="image-preview-card group"
										>
											<img
												src={preview.url}
												alt={`Product preview ${index + 1}`}
											/>
											<button
												type="button"
												className="btn-delete-preview"
												onClick={(e) => {
													e.stopPropagation();
													handleRemoveImage(index);
												}}
												title="Remove drop image"
											>
												<RiCloseLine size={12} />
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Launch Button Section */}
					<div className="pt-6 border-t border-zinc-200 mt-auto">
						<Button
							type="submit"
							variant="primary"
							fullWidth={true}
							isLoading={isSubmitting}
							loadingText="Launching Catalog Drop..."
							className="py-3! text-xs font-bold uppercase tracking-widest bg-zinc-950 hover:bg-zinc-800 text-white transition-all duration-300 shadow-md"
							disabled={isSubmitting}
						>
							Launch Drop Item
						</Button>
					</div>
				</div>

				{/* PART 3: VARIANTS */}
				<div className="lg:col-span-12 space-y-6 premium-card p-6 sm:p-8">
					<div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-2">
						<div className="flex items-center">
							<span className="section-badge">3</span>
							<h3 className="text-sm font-semibold tracking-wider text-zinc-800 uppercase">
								Variants
							</h3>
							<span className="ml-3 text-[10px] font-light text-zinc-400 uppercase tracking-wider">
								Optional
							</span>
						</div>
						<button
							type="button"
							onClick={handleAddVariant}
							disabled={isSubmitting}
							className="variant-add-btn"
						>
							<RiAddLine size={14} />
							<span>Add Variant</span>
						</button>
					</div>

					{variants.length === 0 && (
						<div className="flex flex-col items-center justify-center py-10 text-center">
							<div className="p-4 rounded-full bg-zinc-50 border border-zinc-200 mb-4 text-zinc-400">
								<RiStackLine size={24} />
							</div>
							<p className="text-xs text-zinc-500 font-light max-w-xs">
								Add size, colour, or material variants with independent stock, pricing, and imagery.
							</p>
						</div>
					)}

					{variants.map((variant, vIndex) => (
						<div
							key={vIndex}
							className="variant-card animate-fade-in-up"
						>
							{/* Variant header */}
							<div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
								<p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
									Variant {vIndex + 1}
								</p>
								<button
									type="button"
									className="variant-remove-btn"
									onClick={() => handleRemoveVariant(vIndex)}
									title="Remove variant"
								>
									<RiDeleteBinLine size={14} />
								</button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								{/* Left: fields */}
								<div className="space-y-4">
									{/* Stock */}
									<Input
										label="Stock Quantity"
										type="number"
										id={`variant-stock-${vIndex}`}
										name="stock"
										value={variant.stock}
										onChange={(e) => handleVariantChange(vIndex, "stock", e.target.value)}
										placeholder="e.g. 50"
										disabled={isSubmitting}
									/>

									{/* Price override */}
									<div className="grid grid-cols-3 gap-3">
										<div className="col-span-2">
											<Input
												label="Variant Price"
												type="text"
												id={`variant-price-${vIndex}`}
												name="priceAmount"
												value={variant.priceAmount}
												onChange={(e) => handleVariantChange(vIndex, "priceAmount", e.target.value)}
												placeholder="e.g. 6499"
												required={true}
												disabled={isSubmitting}
												icon={RiMoneyDollarCircleLine}
											/>
										</div>
										<div>
											<label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
												Currency
											</label>
											<select
												value={variant.priceCurrency || formData.priceCurrency}
												onChange={(e) => handleVariantChange(vIndex, "priceCurrency", e.target.value)}
												className="form-input premium-select w-full pl-3! bg-white cursor-pointer text-sm outline-none"
												disabled={isSubmitting}
											>
												<option value="INR">INR</option>
												<option value="USD">USD</option>
												<option value="EUR">EUR</option>
												<option value="GBP">GBP</option>
											</select>
										</div>
									</div>

									{/* Attributes */}
									<div>
										<div className="flex items-center justify-between mb-2">
											<label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
												Attributes
											</label>
											<button
												type="button"
												onClick={() => handleAddAttribute(vIndex)}
												className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 uppercase tracking-wider transition-colors"
												disabled={isSubmitting}
											>
												+ Add
											</button>
										</div>
										<div className="space-y-2">
											{variant.attributes.map((attr, aIndex) => (
												<div
													key={aIndex}
													className="flex items-center gap-2"
												>
													<input
														type="text"
														placeholder="Key (e.g. Size)"
														value={attr.key}
														onChange={(e) => handleVariantAttributeChange(vIndex, aIndex, "key", e.target.value)}
														className="form-input variant-attr-input flex-1"
														disabled={isSubmitting}
													/>
													<input
														type="text"
														placeholder="Value (e.g. XL)"
														value={attr.value}
														onChange={(e) => handleVariantAttributeChange(vIndex, aIndex, "value", e.target.value)}
														className="form-input variant-attr-input flex-1"
														disabled={isSubmitting}
													/>
													{variant.attributes.length > 1 && (
														<button
															type="button"
															onClick={() => handleRemoveAttribute(vIndex, aIndex)}
															className="variant-attr-delete"
															title="Remove attribute"
														>
															<RiCloseLine size={12} />
														</button>
													)}
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Right: variant images */}
								<div className="space-y-3">
									<label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
										Variant Images
									</label>
									<div
										className="uploader-dropzone variant-img-dropzone p-5 flex flex-col items-center justify-center cursor-pointer"
										onDragOver={handleVariantDragOver}
										onDrop={(e) => handleVariantDrop(vIndex, e)}
										onClick={() => {
											const input = document.createElement("input");
											input.type = "file";
											input.multiple = true;
											input.accept = "image/*";
											input.onchange = (e) => handleVariantFileSelect(vIndex, e);
											input.click();
										}}
									>
										<RiImageAddLine
											size={16}
											className="text-zinc-400 mb-1.5"
										/>
										<p className="text-[10px] text-zinc-500 font-light">Drop or click to add images</p>
									</div>

									{variantImagePreviews[vIndex]?.length > 0 && (
										<div className="grid grid-cols-4 gap-2">
											{variantImagePreviews[vIndex].map((preview, imgIdx) => (
												<div
													key={preview.id}
													className="image-preview-card variant-img-preview group"
												>
													<img
														src={preview.url}
														alt={`Variant ${vIndex + 1} image ${imgIdx + 1}`}
													/>
													<button
														type="button"
														className="btn-delete-preview"
														onClick={() => handleRemoveVariantImage(vIndex, imgIdx)}
														title="Remove image"
													>
														<RiCloseLine size={10} />
													</button>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</form>
		</div>
	);
};

export default CreateProduct;
