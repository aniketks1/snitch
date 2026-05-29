import { useEffect, useState } from "react";
import Button from "../../../shared/components/Button";
import useHealthCheck from "../hooks/useHealthCheck";

const Home = () => {
	const [isServerHealthy, setIsServerHealthy] = useState(null);
	const healthCheck = useHealthCheck();

	const checkServerHealth = async () => {
		setIsServerHealthy(null);
		const response = await healthCheck();
		// console.log(response);
		if (response.success) {
			setIsServerHealthy(true);
		} else {
			setIsServerHealthy(false);
		}
	};

	useEffect(() => {
		checkServerHealth();
	}, []);

	// Background Blob Color determines the glow
	const blobColor1 =
		isServerHealthy === null ? "bg-zinc-200/40" : isServerHealthy ? "bg-emerald-100/40" : "bg-rose-100/40";

	const blobColor2 =
		isServerHealthy === null ? "bg-zinc-100/30" : isServerHealthy ? "bg-teal-50/20" : "bg-amber-50/20";

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center bg-light-radial px-4 text-center overflow-hidden">
			{/* Custom Embedded CSS for background animations */}
			<style>{`
				@keyframes float-blob-1 {
					0%, 100% { transform: translate(0px, 0px) scale(1); }
					33% { transform: translate(30px, -50px) scale(1.15); }
					66% { transform: translate(-20px, 20px) scale(0.95); }
				}
				@keyframes float-blob-2 {
					0%, 100% { transform: translate(0px, 0px) scale(1.05); }
					50% { transform: translate(-40px, 40px) scale(0.9); }
				}
				.animate-blob-1 {
					animation: float-blob-1 15s infinite ease-in-out;
				}
				.animate-blob-2 {
					animation: float-blob-2 18s infinite ease-in-out;
				}
			`}</style>

			{/* Amazing Premium Background Elements */}
			{/* 1. Sleek High-Tech Grid with radial fade mask */}
			<div
				className="absolute inset-0 bg-grid-light pointer-events-none opacity-80"
				style={{
					maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
					WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)",
				}}
			/>

			{/* 2. Soft Dynamic Glowing Neon Blobs */}
			<div
				className={`absolute top-1/4 left-1/4 w-140 h-140 ${blobColor1} rounded-full blur-[110px] pointer-events-none animate-blob-1`}
			/>
			<div
				className={`absolute bottom-1/4 right-1/4 w-130 h-130 ${blobColor2} rounded-full blur-[130px] pointer-events-none animate-blob-2`}
			/>

			{/* Foreground Content */}
			<div className="relative z-10 max-w-md space-y-6">
				{/* Brand Logo / Text with rich dark metallic text-gradient */}
				<h1 className="text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-zinc-900 to-zinc-500 select-none">
					SNITCH
				</h1>

				{/* Status Badge */}
				{isServerHealthy === null && (
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 text-xs font-semibold tracking-wider uppercase shadow-xs">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
						</span>
						Checking Status
					</div>
				)}

				{isServerHealthy === true && (
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wider uppercase shadow-xs">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
						</span>
						Server Operational
					</div>
				)}

				{isServerHealthy === false && (
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold tracking-wider uppercase shadow-xs">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
						</span>
						Server Offline
					</div>
				)}

				{/* Title and Message */}
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
						{isServerHealthy === null && "Connecting to Snitch"}
						{isServerHealthy === true && "Welcome to Snitch"}
						{isServerHealthy === false && "System Offline"}
					</h2>
					<p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed font-light">
						{isServerHealthy === null && "Establishing connection and verifying service health..."}
						{isServerHealthy === true &&
							"The background monitoring and analysis services are up and running flawlessly. Ready for requests."}
						{isServerHealthy === false &&
							"The background monitoring and analysis services could not be reached. Please check the server console."}
					</p>
				</div>

				{/* Quick Stats Grid to make it look premium */}
				<div className="grid grid-cols-2 gap-4 pt-2">
					<div className="p-4 rounded-xl bg-white/80 border border-zinc-200/80 backdrop-blur-md shadow-xs">
						<div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Server Status</div>
						<div className="mt-1 text-sm font-semibold tracking-wide">
							{isServerHealthy === null && <span className="text-zinc-500">CHECKING...</span>}
							{isServerHealthy === true && <span className="text-emerald-600 font-bold">HEALTHY</span>}
							{isServerHealthy === false && <span className="text-rose-600 font-bold">UNHEALTHY</span>}
						</div>
					</div>
					<div className="p-4 rounded-xl bg-white/80 border border-zinc-200/80 backdrop-blur-md shadow-xs">
						<div className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Uptime</div>
						<div className="mt-1 text-sm font-semibold tracking-wide">
							{isServerHealthy === null && <span className="text-zinc-400">LOCKED</span>}
							{isServerHealthy === true && <span className="text-zinc-800 font-bold">100.0%</span>}
							{isServerHealthy === false && <span className="text-rose-600 font-bold">0.0%</span>}
						</div>
					</div>
				</div>

				{/* Primary Action Button */}
				<div className="pt-4">
					{isServerHealthy === false ? (
						<Button
							onClick={checkServerHealth}
							variant="danger"
							className="px-6 py-3! text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md"
						>
							Retry Health Check
						</Button>
					) : (
						<Button
							to="/dashboard"
							variant="primary"
							disabled={isServerHealthy === null}
							className="px-6 py-3! text-xs font-bold uppercase tracking-widest bg-zinc-950! hover:bg-zinc-800! text-white! transition-all duration-300 shadow-md"
						>
								Access the System
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
