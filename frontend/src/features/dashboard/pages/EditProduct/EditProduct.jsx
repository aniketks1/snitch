import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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
	RiLoader5Line,
} from "@remixicon/react";
import "./EditProduct.css";

const EMPTY_VARIANT = { stock: "", priceAmount: "", priceCurrency: "", attributes: [{ key: "", value: "" }] };

const EditProduct = () => {
	const { productId } = useParams();
	const { handleGetProductDetails, handleUpdateProduct } = useSellerProduct();
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	// Loading / fetching state
	const [loading, setLoading] = useState(true);

	const [formData, setFormData] = useState({ title: "", description: "", priceAmount: "", priceCurrency: "INR" });

	// Existing images (already on server — stored as URL strings)
	const [existingImages, setExistingImages] = useState([]);
	// Newly added images (File objects)
	const [newImages, setNewImages] = useState([]);
	const [newImagePreviews, setNewImagePreviews] = useState([]);

	const [isDragActive, setIsDragActive] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	// --- Variants state ---
	const [variants, setVariants] = useState([]);
	// Existing variant images per variant index { [idx]: string[] (URLs) }
	const [existingVariantImages, setExistingVariantImages] = useState({});
	// New variant images per variant index { [idx]: File[] }
	const [newVariantImages, setNewVariantImages] = useState({});
	const [newVariantImagePreviews, setNewVariantImagePreviews] = useState({});

	// ─── Fetch product data ───
	useEffect(() => {
		async function fetchProduct() {
			setLoading(true);
			try {
				const product = await handleGetProductDetails({ productId });
				if (!product) {
					setErrorMsg("Product not found.");
					setLoading(false);
					return;
				}

				setFormData({
					title: product.title || "",
					description: product.description || "",
					priceAmount: product.price?.amount?.toString() || "",
					priceCurrency: product.price?.currency || "INR",
				});

				setExistingImages(product.images?.map((img) => img.url) || []);

				// Map variants from DB format to form format
				if (product.variants && product.variants.length > 0) {
					const mappedVariants = product.variants.map((v) => {
						const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
						const attrArray = Object.entries(attrs).length > 0
							? Object.entries(attrs).map(([key, value]) => ({ key, value }))
							: [{ key: "", value: "" }];

						return {
							stock: v.stock?.toString() || "0",
							priceAmount: v.price?.amount?.toString() || "",
							priceCurrency: v.price?.currency || "",
							attributes: attrArray,
						};
					});
					setVariants(mappedVariants);

					const existVarImgs = {};
					product.variants.forEach((v, i) => {
						existVarImgs[i] = v.images?.map((img) => img.url) || [];
					});
					setExistingVariantImages(existVarImgs);
				}
			} catch {
				setErrorMsg("Failed to load product.");
			}
			setLoading(false);
		}
		fetchProduct();
	}, [productId]);

	// Generate previews for newly added product images
	useEffect(() => {
		if (newImages.length === 0) {
			setNewImagePreviews([]);
			return;
		}
		const objectUrls = newImages.map((image) => ({
			id: Math.random().toString(36).substring(2, 9),
			name: image.name,
			url: URL.createObjectURL(image),
		}));
		setNewImagePreviews(objectUrls);
		return () => {
			objectUrls.forEach((p) => URL.revokeObjectURL(p.url));
		};
	}, [newImages]);

	// Generate previews for newly added variant images
	useEffect(() => {
		const newPreviews = {};
		Object.entries(newVariantImages).forEach(([index, files]) => {
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
		// Revoke old
		Object.values(newVariantImagePreviews).forEach((previews) => {
			previews?.forEach((p) => URL.revokeObjectURL(p.url));
		});
		setNewVariantImagePreviews(newPreviews);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newVariantImages]);

	const totalImages = existingImages.length + newImages.length;

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// ─── Product image handlers ───
	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
		else if (e.type === "dragleave") setIsDragActive(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			addNewImages(Array.from(e.dataTransfer.files));
		}
	};

	const handleFileSelect = (e) => {
		if (e.target.files && e.target.files[0]) {
			addNewImages(Array.from(e.target.files));
		}
	};

	const addNewImages = (files) => {
		const imageFiles = files.filter((f) => f.type.startsWith("image/"));
		if (imageFiles.length === 0) return;
		const allowed = 7 - totalImages;
		if (allowed <= 0) {
			setErrorMsg("Maximum of 7 images only are allowed.");
			return;
		}
		const toAdd = imageFiles.slice(0, allowed);
		if (toAdd.length < imageFiles.length) setErrorMsg("Maximum of 7 images only are allowed.");
		setNewImages((prev) => [...prev, ...toAdd]);
	};

	const handleRemoveExistingImage = (index) => {
		setExistingImages((prev) => prev.filter((_, i) => i !== index));
		if (errorMsg.includes("7")) setErrorMsg("");
	};

	const handleRemoveNewImage = (index) => {
		setNewImages((prev) => prev.filter((_, i) => i !== index));
		if (errorMsg.includes("7")) setErrorMsg("");
	};

	// ─── Variant handlers ───
	const handleAddVariant = () => {
		setVariants((prev) => [...prev, { ...EMPTY_VARIANT, attributes: [{ key: "", value: "" }] }]);
	};

	const handleRemoveVariant = (idx) => {
		setVariants((prev) => prev.filter((_, i) => i !== idx));
		// Re-index existing and new variant images
		setExistingVariantImages((prev) => {
			const next = {};
			Object.keys(prev).forEach((key) => {
				const k = Number(key);
				if (k < idx) next[k] = prev[k];
				else if (k > idx) next[k - 1] = prev[k];
			});
			return next;
		});
		setNewVariantImages((prev) => {
			const next = {};
			Object.keys(prev).forEach((key) => {
				const k = Number(key);
				if (k < idx) next[k] = prev[k];
				else if (k > idx) next[k - 1] = prev[k];
			});
			return next;
		});
	};

	const handleVariantChange = (vIdx, field, value) => {
		setVariants((prev) => prev.map((v, i) => (i === vIdx ? { ...v, [field]: value } : v)));
	};

	const handleVariantAttributeChange = (vIdx, aIdx, field, value) => {
		setVariants((prev) =>
			prev.map((v, i) => {
				if (i !== vIdx) return v;
				const newAttrs = v.attributes.map((a, ai) => (ai === aIdx ? { ...a, [field]: value } : a));
				return { ...v, attributes: newAttrs };
			}),
		);
	};

	const handleAddAttribute = (vIdx) => {
		setVariants((prev) =>
			prev.map((v, i) => (i === vIdx ? { ...v, attributes: [...v.attributes, { key: "", value: "" }] } : v)),
		);
	};

	const handleRemoveAttribute = (vIdx, aIdx) => {
		setVariants((prev) =>
			prev.map((v, i) => (i === vIdx ? { ...v, attributes: v.attributes.filter((_, ai) => ai !== aIdx) } : v)),
		);
	};

	const handleVariantFileSelect = (vIdx, e) => {
		if (e.target.files && e.target.files[0]) {
			addNewVariantFiles(vIdx, Array.from(e.target.files));
		}
	};

	const addNewVariantFiles = (vIdx, files) => {
		const imageFiles = files.filter((f) => f.type.startsWith("image/"));
		if (imageFiles.length > 0) {
			setNewVariantImages((prev) => ({
				...prev,
				[vIdx]: [...(prev[vIdx] || []), ...imageFiles].slice(0, 5),
			}));
		}
	};

	const handleVariantDrop = (vIdx, e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			addNewVariantFiles(vIdx, Array.from(e.dataTransfer.files));
		}
	};

	const handleVariantDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleRemoveExistingVariantImage = (vIdx, imgIdx) => {
		setExistingVariantImages((prev) => ({
			...prev,
			[vIdx]: (prev[vIdx] || []).filter((_, i) => i !== imgIdx),
		}));
	};

	const handleRemoveNewVariantImage = (vIdx, imgIdx) => {
		setNewVariantImages((prev) => ({
			...prev,
			[vIdx]: (prev[vIdx] || []).filter((_, i) => i !== imgIdx),
		}));
	};

	// ─── Submit ───
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMsg("");
		setSuccessMsg("");

		if (!formData.title.trim()) { setErrorMsg("Product title is required."); return; }
		if (!formData.priceAmount || isNaN(Number(formData.priceAmount))) { setErrorMsg("Please enter a valid price amount."); return; }
		if (totalImages === 0) { setErrorMsg("Please keep or upload at least one product image."); return; }

		for (let i = 0; i < variants.length; i++) {
			if (!variants[i].priceAmount || isNaN(Number(variants[i].priceAmount))) {
				setErrorMsg(`Variant ${i + 1}: Please enter a valid price amount.`);
				return;
			}
		}

		setIsSubmitting(true);

		try {
			const variantData = variants.map((v) => ({
				stock: Number(v.stock) || 0,
				priceAmount: Number(v.priceAmount),
				priceCurrency: v.priceCurrency || formData.priceCurrency,
				attributes: Object.fromEntries(v.attributes.filter((a) => a.key.trim()).map((a) => [a.key, a.value])),
			}));

			// Build existingVariantImages map (URLs to keep per index)
			const existVarImgsPayload = {};
			variants.forEach((_, idx) => {
				existVarImgsPayload[idx] = existingVariantImages[idx] || [];
			});

			const result = await handleUpdateProduct({
				productId,
				title: formData.title,
				description: formData.description,
				priceAmount: Number(formData.priceAmount),
				priceCurrency: formData.priceCurrency,
				existingImages,
				newImages,
				variants: variantData.length > 0 ? variantData : [],
				existingVariantImages: existVarImgsPayload,
				variantImages: Object.keys(newVariantImages).length > 0 ? newVariantImages : undefined,
			});

			if (result?.success) {
				setSuccessMsg("Product updated successfully!");
				setTimeout(() => navigate("/dashboard"), 2000);
			} else {
				setErrorMsg(result?.message || "Failed to update product.");
			}
		} catch (error) {
			setErrorMsg(error?.message || "Failed to update product. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// ─── Loading skeleton ───
	if (loading) {
		return (
			<div className="edit-product-container animate-fade-in-up">
				<div className="mb-10">
					<div className="skeleton h-8 w-64 mb-3" />
					<div className="skeleton h-4 w-96" />
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					<div className="lg:col-span-7 space-y-5">
						<div className="skeleton h-12 w-full" />
						<div className="skeleton h-12 w-full" />
						<div className="skeleton h-28 w-full" />
					</div>
					<div className="lg:col-span-5 space-y-5">
						<div className="skeleton h-40 w-full" />
						<div className="skeleton h-20 w-full" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="edit-product-container animate-fade-in-up">
			{/* Header */}
			<div className="mb-10 text-center sm:text-left">
				<h2 className="text-3xl font-light tracking-wide text-zinc-900 uppercase">
					Edit Product <span className="font-semibold text-zinc-500">Drop</span>
				</h2>
				<p className="mt-2 text-sm font-light text-zinc-500 leading-relaxed max-w-xl">
					Update your product details, images, and variants. Changes are published immediately.
				</p>
			</div>

			{/* Error Banner */}
			{errorMsg && (
				<div className="mb-8 p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-rose-600 text-sm font-light flex items-center gap-3 animate-fade-in-up">
					<RiErrorWarningLine size={18} className="shrink-0 text-rose-500" />
					{errorMsg}
				</div>
			)}

			{/* Success Banner */}
			{successMsg && (
				<div className="mb-8 p-4 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 text-sm font-light flex items-center gap-3 animate-fade-in-up">
					<div className="h-6 w-6 rounded-full bg-zinc-950 flex items-center justify-center shrink-0">
						<RiCheckLine size={14} className="text-zinc-50 font-bold" />
					</div>
					<div className="flex-1">
						<p className="font-semibold text-zinc-900">Product Updated</p>
						<p className="text-xs text-zinc-500 mt-0.5">{successMsg} Redirecting...</p>
					</div>
				</div>
			)}

			<form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* ── PART 1: PRODUCT DETAILS ── */}
				<div className="lg:col-span-7 space-y-6 premium-card p-6 sm:p-8">
					<div className="flex items-center pb-4 border-b border-zinc-200 mb-2">
						<span className="section-badge">1</span>
						<h3 className="text-sm font-semibold tracking-wider text-zinc-800 uppercase">Product Details</h3>
					</div>

					<Input
						label="Product Name / Title"
						type="text" id="title" name="title"
						value={formData.title}
						onChange={handleInputChange}
						placeholder="e.g. Minimalist Charcoal Trenchcoat"
						required={true} disabled={isSubmitting}
						icon={RiFileList3Line}
					/>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
						<div className="sm:col-span-2">
							<Input
								label="Price Amount"
								type="text" id="priceAmount" name="priceAmount"
								value={formData.priceAmount}
								onChange={handleInputChange}
								placeholder="e.g. 5999"
								required={true} disabled={isSubmitting}
								icon={RiMoneyDollarCircleLine}
							/>
						</div>
						<div>
							<label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Currency</label>
							<select
								name="priceCurrency" id="priceCurrency"
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

					<div>
						<label htmlFor="description" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Description</label>
						<textarea
							id="description" name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder="Describe the product..."
							className="premium-textarea"
							disabled={isSubmitting} required
						/>
					</div>
				</div>

				{/* ── PART 2: IMAGES ── */}
				<div className="lg:col-span-5 space-y-6 premium-card p-6 sm:p-8 flex flex-col justify-between">
					<div className="space-y-6">
						<div className="flex items-center pb-4 border-b border-zinc-200 mb-2">
							<span className="section-badge">2</span>
							<h3 className="text-sm font-semibold tracking-wider text-zinc-800 uppercase">Product Images</h3>
						</div>

						{/* Drag & Drop */}
						<div
							className={`uploader-dropzone p-8 text-center flex flex-col items-center justify-center min-h-40 ${isDragActive ? "drag-active border-zinc-900" : ""} ${totalImages >= 7 ? "opacity-50 cursor-not-allowed! border-dashed border-zinc-200 bg-zinc-50" : ""}`}
							onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
							onClick={() => {
								if (totalImages >= 7) setErrorMsg("Maximum of 7 images only are allowed.");
								else fileInputRef.current?.click();
							}}
						>
							<input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" disabled={isSubmitting} />
							<div className="p-3.5 rounded-full bg-zinc-50 border border-zinc-200 mb-3 text-zinc-500">
								<RiImageAddLine size={20} className="animate-pulse" />
							</div>
							<p className="text-xs text-zinc-700 font-semibold uppercase tracking-wider">Add more images</p>
							<p className="text-[10px] text-zinc-500 mt-1 font-light">or click to browse (JPEG, PNG, WebP)</p>
						</div>

						{/* Existing images */}
						{existingImages.length > 0 && (
							<div className="space-y-3">
								<p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current Images ({existingImages.length})</p>
								<div className="grid grid-cols-3 gap-3">
									{existingImages.map((url, index) => (
										<div key={`ex-${index}`} className="image-preview-card group">
											<img src={url} alt={`Existing ${index + 1}`} />
											<button type="button" className="btn-delete-preview" onClick={(e) => { e.stopPropagation(); handleRemoveExistingImage(index); }} title="Remove image">
												<RiCloseLine size={12} />
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						{/* New images */}
						{newImagePreviews.length > 0 && (
							<div className="space-y-3">
								<p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">New Images ({newImagePreviews.length})</p>
								<div className="grid grid-cols-3 gap-3">
									{newImagePreviews.map((preview, index) => (
										<div key={preview.id} className="image-preview-card group edit-new-img">
											<img src={preview.url} alt={`New ${index + 1}`} />
											<span className="edit-new-badge">NEW</span>
											<button type="button" className="btn-delete-preview" onClick={(e) => { e.stopPropagation(); handleRemoveNewImage(index); }} title="Remove image">
												<RiCloseLine size={12} />
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Submit */}
					<div className="pt-6 border-t border-zinc-200 mt-auto">
						<Button
							type="submit" variant="primary" fullWidth={true}
							isLoading={isSubmitting} loadingText="Saving Changes..."
							className="py-3! text-xs font-bold uppercase tracking-widest bg-zinc-950 hover:bg-zinc-800 text-white transition-all duration-300 shadow-md"
							disabled={isSubmitting}
						>
							Save Changes
						</Button>
					</div>
				</div>

				{/* ── PART 3: VARIANTS ── */}
				<div className="lg:col-span-12 space-y-6 premium-card p-6 sm:p-8">
					<div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-2">
						<div className="flex items-center">
							<span className="section-badge">3</span>
							<h3 className="text-sm font-semibold tracking-wider text-zinc-800 uppercase">Variants</h3>
							<span className="ml-3 text-[10px] font-light text-zinc-400 uppercase tracking-wider">Optional</span>
						</div>
						<button type="button" onClick={handleAddVariant} disabled={isSubmitting} className="variant-add-btn">
							<RiAddLine size={14} />
							<span>Add Variant</span>
						</button>
					</div>

					{variants.length === 0 && (
						<div className="flex flex-col items-center justify-center py-10 text-center">
							<div className="p-4 rounded-full bg-zinc-50 border border-zinc-200 mb-4 text-zinc-400">
								<RiStackLine size={24} />
							</div>
							<p className="text-xs text-zinc-500 font-light max-w-xs">No variants. Add size, colour, or material variants.</p>
						</div>
					)}

					{variants.map((variant, vIndex) => (
						<div key={vIndex} className="variant-card animate-fade-in-up">
							<div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
								<p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Variant {vIndex + 1}</p>
								<button type="button" className="variant-remove-btn" onClick={() => handleRemoveVariant(vIndex)} title="Remove variant">
									<RiDeleteBinLine size={14} />
								</button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								{/* Left: Fields */}
								<div className="space-y-4">
									<Input
										label="Stock Quantity" type="number"
										id={`variant-stock-${vIndex}`} name="stock"
										value={variant.stock}
										onChange={(e) => handleVariantChange(vIndex, "stock", e.target.value)}
										placeholder="e.g. 50" disabled={isSubmitting}
									/>

									<div className="grid grid-cols-3 gap-3">
										<div className="col-span-2">
											<Input
												label="Variant Price" type="text"
												id={`variant-price-${vIndex}`} name="priceAmount"
												value={variant.priceAmount}
												onChange={(e) => handleVariantChange(vIndex, "priceAmount", e.target.value)}
												placeholder="e.g. 6499" required={true} disabled={isSubmitting}
												icon={RiMoneyDollarCircleLine}
											/>
										</div>
										<div>
											<label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Currency</label>
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
											<label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Attributes</label>
											<button type="button" onClick={() => handleAddAttribute(vIndex)} className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 uppercase tracking-wider transition-colors" disabled={isSubmitting}>+ Add</button>
										</div>
										<div className="space-y-2">
											{variant.attributes.map((attr, aIndex) => (
												<div key={aIndex} className="flex items-center gap-2">
													<input type="text" placeholder="Key (e.g. Size)" value={attr.key} onChange={(e) => handleVariantAttributeChange(vIndex, aIndex, "key", e.target.value)} className="form-input variant-attr-input flex-1" disabled={isSubmitting} />
													<input type="text" placeholder="Value (e.g. XL)" value={attr.value} onChange={(e) => handleVariantAttributeChange(vIndex, aIndex, "value", e.target.value)} className="form-input variant-attr-input flex-1" disabled={isSubmitting} />
													{variant.attributes.length > 1 && (
														<button type="button" onClick={() => handleRemoveAttribute(vIndex, aIndex)} className="variant-attr-delete" title="Remove attribute">
															<RiCloseLine size={12} />
														</button>
													)}
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Right: Variant images */}
								<div className="space-y-3">
									<label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Variant Images</label>

									{/* Existing variant images */}
									{(existingVariantImages[vIndex]?.length > 0) && (
										<div className="space-y-2">
											<p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Current</p>
											<div className="grid grid-cols-4 gap-2">
												{existingVariantImages[vIndex].map((url, imgIdx) => (
													<div key={`ev-${vIndex}-${imgIdx}`} className="image-preview-card variant-img-preview group">
														<img src={url} alt={`Variant ${vIndex + 1} existing ${imgIdx + 1}`} />
														<button type="button" className="btn-delete-preview" onClick={() => handleRemoveExistingVariantImage(vIndex, imgIdx)} title="Remove image">
															<RiCloseLine size={10} />
														</button>
													</div>
												))}
											</div>
										</div>
									)}

									{/* New variant images */}
									{(newVariantImagePreviews[vIndex]?.length > 0) && (
										<div className="space-y-2">
											<p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">New</p>
											<div className="grid grid-cols-4 gap-2">
												{newVariantImagePreviews[vIndex].map((preview, imgIdx) => (
													<div key={preview.id} className="image-preview-card variant-img-preview group edit-new-img">
														<img src={preview.url} alt={`Variant ${vIndex + 1} new ${imgIdx + 1}`} />
														<span className="edit-new-badge" style={{ fontSize: "7px" }}>NEW</span>
														<button type="button" className="btn-delete-preview" onClick={() => handleRemoveNewVariantImage(vIndex, imgIdx)} title="Remove image">
															<RiCloseLine size={10} />
														</button>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Upload zone */}
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
										<RiImageAddLine size={16} className="text-zinc-400 mb-1.5" />
										<p className="text-[10px] text-zinc-500 font-light">Drop or click to add images</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</form>
		</div>
	);
};

export default EditProduct;
