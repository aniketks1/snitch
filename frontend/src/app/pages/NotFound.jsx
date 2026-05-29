import Button from "../../shared/components/Button";

const NotFound = () => {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center bg-dark-radial px-4 text-center overflow-hidden">
			{/* Amazing Premium Background Elements */}
			{/* 1. Sleek High-Tech Grid with radial fade mask */}
			<div
				className="absolute inset-0 bg-grid pointer-events-none opacity-40"
				style={{
					maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
					WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
				}}
			/>

			{/* 2. Soft Dynamic Glowing Neon Blobs */}
			<div className="absolute top-1/4 left-1/4 w-140 h-140 bg-indigo-500/10 rounded-full blur-[110px] pointer-events-none animate-blob-1" />
			<div className="absolute bottom-1/4 right-1/4 w-120 h-120 bg-fuchsia-500/5 rounded-full blur-[130px] pointer-events-none animate-blob-2" />

			{/* Foreground Content (Kept clean, elegant, and simple) */}
			<div className="relative z-10 max-w-md space-y-6">
				{/* 404 Header with metallic modern text-gradient */}
				<h1 className="text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-zinc-100 to-zinc-500 select-none">
					404
				</h1>

				{/* Title and Message */}
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">Page Not Found</h2>
					<p className="text-sm text-zinc-400">
						The page you are looking for doesn't exist or has been moved.
					</p>
				</div>

				{/* Return Link Button */}
				<div className="pt-4">
					<Button
						to="/"
						variant="primary"
					>
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
